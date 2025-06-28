import { NoticiaRep } from '../repository/NoticiasRep';
import puppeteer from 'puppeteer';

const BASE_URL = 'https://pmp.pr.gov.br/website/views/';

async function retry<T>(fn: () => Promise<T>, retries = 3, delayMs = 5000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Tentativa ${i + 1} falhou. Retentando em ${delayMs}ms...`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}

export async function cronusNoticias() {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Carrega página principal com retry
    await retry(async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
      await page.waitForSelector('.col');
    });

    const noticias = await page.evaluate((BASE_URL) => {
      const results: { title: string; weblink: string }[] = [];
      const elements = document.querySelectorAll('.col');

      elements.forEach(el => {
        const titleEl = el.querySelector('.card-title, h5');
        const linkEl = el.querySelector('a');

        const title = titleEl ? titleEl.textContent?.trim() : '';
        let weblink = linkEl ? (linkEl as HTMLAnchorElement).href : '';

        if (weblink && !weblink.startsWith('http')) {
          weblink = BASE_URL + weblink;
        }

        if (
          title &&
          weblink &&
          !['Daniel Langaro', 'Edson Lagarto'].includes(title)
        ) {
          results.push({ title, weblink });
        }
      });

      return results;
    }, BASE_URL);

    for (const noticia of noticias) {
      try {
        const exists = await NoticiaRep.findOneBy({ title: noticia.title });
        if (exists) continue;

        // Abre nova aba para cada notícia com retry
        const detailPage = await browser.newPage();

        await retry(async () => {
          await detailPage.goto(noticia.weblink, { waitUntil: 'networkidle2' });
          await detailPage.waitForSelector('.post-content');
        });

        const { thumbnail, description } = await detailPage.evaluate((BASE_URL) => {
          const imgEl = document.querySelector('img.img-responsive.card-img-top');
          let rawThumbnail = imgEl ? imgEl.getAttribute('src') || '' : '';
          if (rawThumbnail && !rawThumbnail.startsWith('http')) {
            rawThumbnail = BASE_URL + rawThumbnail;
          }

          const descEl = document.querySelector('.post-content');
          const description = descEl ? descEl.textContent?.trim() || '' : '';

          return { thumbnail: rawThumbnail, description };
        }, BASE_URL);

        await detailPage.close();

        const novaNoticia = NoticiaRep.create({
          cidadeId: 1,
          title: noticia.title,
          thumbnail,
          description,
          weblink: noticia.weblink,
          publish: new Date(),
        });

        await NoticiaRep.save(novaNoticia);
      } catch (err) {
        console.error(`Wall-e, ops!: ${noticia.title}`);
      }
    }
  } catch (err) {
    console.error('Wall-e falhou ao sincronizar: ', err);
  } finally {
    if (browser) await browser.close();
  }
}