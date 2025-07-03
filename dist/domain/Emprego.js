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
exports.Emprego = void 0;
const typeorm_1 = require("typeorm");
const Cidade_1 = require("./Cidade");
const Servico_1 = require("./Servico");
let Emprego = class Emprego {
};
exports.Emprego = Emprego;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'SEQ', type: 'number' }),
    __metadata("design:type", Number)
], Emprego.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CARGO', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Emprego.prototype, "cargo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'QUANTIDADE', type: 'number' }),
    __metadata("design:type", Number)
], Emprego.prototype, "quantidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'REQUISITOS', type: 'clob' }),
    __metadata("design:type", String)
], Emprego.prototype, "requisitos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SERVICO', type: 'number' }),
    __metadata("design:type", Number)
], Emprego.prototype, "servicoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CIDADE', type: 'number' }),
    __metadata("design:type", Number)
], Emprego.prototype, "cidadeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Servico_1.Servico),
    (0, typeorm_1.JoinColumn)({ name: 'SERVICO', referencedColumnName: 'seq' }),
    __metadata("design:type", Servico_1.Servico)
], Emprego.prototype, "servico", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cidade_1.Cidade),
    (0, typeorm_1.JoinColumn)({ name: 'CIDADE', referencedColumnName: 'seq' }),
    __metadata("design:type", Cidade_1.Cidade)
], Emprego.prototype, "cidade", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Emprego.prototype, "publish", void 0);
exports.Emprego = Emprego = __decorate([
    (0, typeorm_1.Entity)({ name: 'EMPREGO' })
], Emprego);
