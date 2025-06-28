"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadoRep = void 0;
const data_source_1 = require("../data-source");
const Estado_1 = require("../domain/Estado");
exports.EstadoRep = data_source_1.AppDataSource.getRepository(Estado_1.Estado);
