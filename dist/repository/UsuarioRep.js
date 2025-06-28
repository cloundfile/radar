"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRep = void 0;
const data_source_1 = require("../data-source");
const Usuario_1 = require("../domain/Usuario");
exports.UsuarioRep = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
