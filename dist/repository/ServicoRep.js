"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoRep = void 0;
const data_source_1 = require("../data-source");
const Servico_1 = require("../domain/Servico");
exports.ServicoRep = data_source_1.AppDataSource.getRepository(Servico_1.Servico);
