"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticiaRep = void 0;
const data_source_1 = require("../data-source");
const Noticia_1 = require("../domain/Noticia");
exports.NoticiaRep = data_source_1.AppDataSource.getRepository(Noticia_1.Noticia);
