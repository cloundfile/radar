"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronusVagas = cronusVagas;
const puppeteer_1 = __importDefault(require("puppeteer"));
const data_source_1 = require("../data-source");
const VagasRep_1 = require("../repository/VagasRep");
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
async function cronusVagas() {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({ headless: true });
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
                const seqResult = await data_source_1.AppDataSource.manager.query(`SELECT SEQ_VAGAS.NEXTVAL AS SEQ FROM DUAL`);
                const nextSeq = seqResult?.[0]?.SEQ;
                if (!nextSeq) {
                    continue;
                }
                const vagaExistente = await VagasRep_1.VagaRep.findOneBy({
                    cargo: vaga.cargo,
                    quantidade: vaga.quantidade
                });
                if (vagaExistente) {
                    continue;
                }
                const novaVaga = VagasRep_1.VagaRep.create({
                    seq: Number(nextSeq),
                    cidadeId: 1,
                    cargo: vaga.cargo,
                    quantidade: vaga.quantidade,
                    requisitos: vaga.requisitos,
                });
                await VagasRep_1.VagaRep.save(novaVaga);
            }
            catch (err) { }
        }
        //Limpa vagas preenchidas
        const vagasNoBanco = await VagasRep_1.VagaRep.find({ where: { cidadeId: 1 } });
        const idsDoScrap = new Set(vagas.map(v => `${v.cargo}::${v.quantidade}`));
        const vagasParaRemover = vagasNoBanco.filter(v => !idsDoScrap.has(`${v.cargo}::${v.quantidade}`));
        for (const vaga of vagasParaRemover) {
            await VagasRep_1.VagaRep.remove(vaga);
        }
    }
    catch (error) {
        console.error('Wall-e falhou ao sincronizar vagas: ', error);
    }
    finally {
        if (browser)
            await browser.close();
    }
}
