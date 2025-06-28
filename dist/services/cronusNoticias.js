"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronusNoticias = cronusNoticias;
const NoticiasRep_1 = require("../repository/NoticiasRep");
const puppeteer_1 = __importDefault(require("puppeteer"));
const BASE_URL = 'https://pmp.pr.gov.br/website/views/';
async function retry(fn, retries = 3, delayMs = 5000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (err) {
            lastError = err;
            console.warn(`Tentativa ${i + 1} falhou. Retentando em ${delayMs}ms...`);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }
    throw lastError;
}
async function cronusNoticias() {
    let browser;
    try {
        browser = await puppeteer_1.default.launch({ headless: true });
        const page = await browser.newPage();
        // Carrega página principal com retry
        await retry(async () => {
            await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
            await page.waitForSelector('.col');
        });
        const noticias = await page.evaluate((BASE_URL) => {
            const results = [];
            const elements = document.querySelectorAll('.col');
            elements.forEach(el => {
                const titleEl = el.querySelector('.card-title, h5');
                const linkEl = el.querySelector('a');
                const title = titleEl ? titleEl.textContent?.trim() : '';
                let weblink = linkEl ? linkEl.href : '';
                if (weblink && !weblink.startsWith('http')) {
                    weblink = BASE_URL + weblink;
                }
                if (title &&
                    weblink &&
                    !['Daniel Langaro', 'Edson Lagarto'].includes(title)) {
                    results.push({ title, weblink });
                }
            });
            return results;
        }, BASE_URL);
        for (const noticia of noticias) {
            try {
                const exists = await NoticiasRep_1.NoticiaRep.findOneBy({ title: noticia.title });
                if (exists)
                    continue;
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
                const novaNoticia = NoticiasRep_1.NoticiaRep.create({
                    cidadeId: 1,
                    title: noticia.title,
                    thumbnail,
                    description,
                    weblink: noticia.weblink,
                    publish: new Date(),
                });
                await NoticiasRep_1.NoticiaRep.save(novaNoticia);
            }
            catch (err) {
                console.error(`Wall-e, ops!: ${noticia.title}`);
            }
        }
    }
    catch (err) {
        console.error('Wall-e falhou ao sincronizar: ', err);
    }
    finally {
        if (browser)
            await browser.close();
    }
}
