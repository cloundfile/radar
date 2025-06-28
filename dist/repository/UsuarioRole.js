"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRoleRep = void 0;
const data_source_1 = require("../data-source");
const UsuarioRole_1 = require("../domain/UsuarioRole");
exports.UsuarioRoleRep = data_source_1.AppDataSource.getRepository(UsuarioRole_1.UsuarioRole);
