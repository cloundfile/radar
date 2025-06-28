import puppeteer from 'puppeteer';
import { AppDataSource } from '../data-source';
import { VagaRep } from '../repository/VagasRep';

const VAGAS_URL = 'https://pmp.pr.gov.br/website/views/vagasEmprego.php';

async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 5000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Tentativa ${i + 1} falhou. Retentando em ${delayMs}ms...`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw lastError;
}

export async function cronusVagas() {
  let browser;
  try {
    browser = await puppeteer.launch({
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
      const results: { cargo: string, quantidade: number, requisitos: string }[] = [];

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
        const seqResult = await AppDataSource.manager.query(`SELECT SEQ_VAGAS.NEXTVAL AS SEQ FROM DUAL`);
        const nextSeq = seqResult?.[0]?.SEQ;

        if (!nextSeq) {
          continue;
        }

        const vagaExistente = await VagaRep.findOneBy({
          cargo: vaga.cargo,
          quantidade: vaga.quantidade
        });

        if (vagaExistente) {
          continue;
        }

        const novaVaga = VagaRep.create({
          seq: Number(nextSeq),
          cidadeId: 1,
          cargo: vaga.cargo,
          quantidade: vaga.quantidade,
          requisitos: vaga.requisitos,
        });

        await VagaRep.save(novaVaga);
      } catch (err) {}
    }

    //Limpa vagas preenchidas
    const vagasNoBanco = await VagaRep.find({ where: { cidadeId: 1 } });
    const idsDoScrap = new Set(vagas.map(v => `${v.cargo}::${v.quantidade}`));
    const vagasParaRemover = vagasNoBanco.filter(v =>
      !idsDoScrap.has(`${v.cargo}::${v.quantidade}`)
    );
    for (const vaga of vagasParaRemover) {
      await VagaRep.remove(vaga);
    }
  } catch (error) {
    console.error('Wall-e falhou ao sincronizar vagas: ', error);
  } finally {
    if (browser) await browser.close();
  }
}