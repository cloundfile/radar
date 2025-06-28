"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesRep = void 0;
const data_source_1 = require("../data-source");
const Role_1 = require("../domain/Role");
exports.RolesRep = data_source_1.AppDataSource.getRepository(Role_1.Role);
