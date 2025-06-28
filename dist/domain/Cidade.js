"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cidade = void 0;
const typeorm_1 = require("typeorm");
const Estado_1 = require("./Estado");
let Cidade = class Cidade {
};
exports.Cidade = Cidade;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'SEQ', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], Cidade.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DESCRICAO', type: 'varchar2', length: 255 }),
    __metadata("design:type", String)
], Cidade.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ESTADO_ID', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], Cidade.prototype, "estadoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DOMINIO', type: 'varchar2', length: 255 }),
    __metadata("design:type", String)
], Cidade.prototype, "dominio", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Cidade.prototype, "publish", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Estado_1.Estado),
    (0, typeorm_1.JoinColumn)({ name: 'ESTADO_ID', referencedColumnName: 'seq' }),
    __metadata("design:type", Estado_1.Estado)
], Cidade.prototype, "estado", void 0);
exports.Cidade = Cidade = __decorate([
    (0, typeorm_1.Entity)('CIDADE')
], Cidade);
