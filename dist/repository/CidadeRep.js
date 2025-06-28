"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidadeRep = void 0;
const data_source_1 = require("../data-source");
const Cidade_1 = require("../domain/Cidade");
exports.CidadeRep = data_source_1.AppDataSource.getRepository(Cidade_1.Cidade);
