"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronusEmprego = cronusEmprego;
const puppeteer_1 = __importDefault(require("puppeteer"));
const data_source_1 = require("../data-source");
const EmpregoRep_1 = require("../repository/EmpregoRep");
const VAGAS_URL = 'https://pmp.pr.gov.br/website/views/vagasEmprego.php';
async function retry(fn, retries = 3, delayMs = 5000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            console.warn(`Tentativa ${i + 1} falhou. Retentando em ${delayMs}ms...`);
            await new Promise(res => setTimeout(res, delayMs));
        }
    }
    throw lastError;
}
async function cronusEmprego() {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await retry(async () => {
            await page.goto(VAGAS_URL, { waitUntil: 'networkidle2' });
            await page.waitForSelector('table tbody tr');
        });
        const vagas = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('table tbody tr'));
            const results = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const cargo = cells[0].textContent?.trim() || '';
                    const quantidadeStr = cells[1].textContent?.trim() || '';
                    const requisitos = cells[2].textContent?.trim() || '';
                    const quantidade = parseInt(quantidadeStr, 10);
                    if (!isNaN(quantidade) && cargo) {
                        results.push({ cargo, quantidade, requisitos });
                    }
                }
            });
            return results;
        });
        for (const vaga of vagas) {
            try {
                const seqResult = await data_source_1.AppDataSource.manager.query(`SELECT SEQ_EMPREGO.NEXTVAL AS SEQ FROM DUAL`);
                const nextSeq = seqResult?.[0]?.SEQ;
                if (!nextSeq) {
                    continue;
                }
                const vagaExistente = await EmpregoRep_1.EmpregoRep.findOneBy({
                    cargo: vaga.cargo,
                    quantidade: vaga.quantidade
                });
                if (vagaExistente) {
                    continue;
                }
                const novaVaga = EmpregoRep_1.EmpregoRep.create({
                    seq: Number(nextSeq),
                    cidadeId: 1,
                    servicoId: 1,
                    cargo: vaga.cargo,
                    quantidade: vaga.quantidade,
                    requisitos: vaga.requisitos,
                });
                await EmpregoRep_1.EmpregoRep.save(novaVaga);
            }
            catch (error) {
                console.error(`Radar save failed: ${error}`);
            }
        }
        const empregoBanco = await EmpregoRep_1.EmpregoRep.find({ where: { cidadeId: 1, servicoId: 2 } });
        const empregoScrap = new Set(vagas.map(v => `${v.cargo}::${v.quantidade}`));
        const empregoRemover = empregoBanco.filter(v => !empregoScrap.has(`${v.cargo}::${v.quantidade}`));
        for (const emprego of empregoRemover) {
            emprego.fechada = new Date();
            await EmpregoRep_1.EmpregoRep.update(emprego.seq, { fechada: emprego.fechada });
        }
    }
    catch (error) {
        console.error(`Radar sync failed: ${error}`);
    }
    finally {
        if (browser)
            await browser.close();
    }
}
