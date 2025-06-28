"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronusNoticias = cronusNoticias;
const NoticiasRep_1 = require("../repository/NoticiasRep");
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://pmp.pr.gov.br/website/views/';
async function cronusNoticias() {
    try {
        const { data: html } = await axios_1.default.get(BASE_URL);
        const $ = cheerio.load(html);
        const noticias = [];
        $('.col').each((_, el) => {
            const title = $(el).find('.card-title, h5').text().trim();
            const weblink = $(el).find('a').attr('href');
            if (title &&
                weblink &&
                !['Daniel Langaro', 'Edson Lagarto'].includes(title)) {
                noticias.push({
                    title,
                    weblink: weblink.startsWith('http') ? weblink : `${BASE_URL}${weblink}`,
                });
            }
        });
        for (const noticia of noticias) {
            try {
                const exists = await NoticiasRep_1.NoticiaRep.findOneBy({ title: noticia.title });
                if (exists) {
                    continue;
                }
                const { data: detailHtml } = await axios_1.default.get(noticia.weblink);
                const $detail = cheerio.load(detailHtml);
                const rawThumbnail = $detail('img.img-responsive.card-img-top').attr('src') || '';
                const thumbnail = rawThumbnail.startsWith('http')
                    ? rawThumbnail
                    : `${BASE_URL}${rawThumbnail}`;
                const description = $detail('.post-content').text().trim();
                const novaNoticia = NoticiasRep_1.NoticiaRep.create({
                    cidadeId: 1,
                    title: noticia.title,
                    thumbnail: thumbnail,
                    description: description,
                    weblink: noticia.weblink,
                    publish: new Date(),
                });
                await NoticiasRep_1.NoticiaRep.save(novaNoticia);
                console.log(`✅ Notícia salva: ${noticia.title}`);
            }
            catch (err) {
                console.error(`❌ Falha ao salvar notícia: ${noticia.title}`, err);
            }
        }
    }
    catch (err) {
        console.error('Cronus falhou ao sincronizar.', err);
    }
}
