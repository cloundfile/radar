"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagaRep = void 0;
const data_source_1 = require("../data-source");
const Vagas_1 = require("../domain/Vagas");
exports.VagaRep = data_source_1.AppDataSource.getRepository(Vagas_1.Vagas);
