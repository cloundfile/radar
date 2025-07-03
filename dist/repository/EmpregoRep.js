"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpregoRep = void 0;
const data_source_1 = require("../data-source");
const Emprego_1 = require("../domain/Emprego");
exports.EmpregoRep = data_source_1.AppDataSource.getRepository(Emprego_1.Emprego);
