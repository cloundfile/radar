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
exports.Noticia = void 0;
const typeorm_1 = require("typeorm");
const Cidade_1 = require("./Cidade");
let Noticia = class Noticia {
};
exports.Noticia = Noticia;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'SEQ', type: 'number' }),
    __metadata("design:type", Number)
], Noticia.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TITLE', type: 'varchar2', length: 255 }),
    __metadata("design:type", String)
], Noticia.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'WEBLINK', type: 'varchar2', length: 255 }),
    __metadata("design:type", String)
], Noticia.prototype, "weblink", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'THUMBNAIL', type: 'varchar2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Noticia.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DESCRIPTION', type: 'clob' }),
    __metadata("design:type", String)
], Noticia.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'CIDADE', type: 'number' }),
    __metadata("design:type", Number)
], Noticia.prototype, "cidadeId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Noticia.prototype, "publish", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cidade_1.Cidade),
    (0, typeorm_1.JoinColumn)({ name: 'CIDADE', referencedColumnName: 'seq' }),
    __metadata("design:type", Cidade_1.Cidade)
], Noticia.prototype, "cidade", void 0);
exports.Noticia = Noticia = __decorate([
    (0, typeorm_1.Entity)({ name: 'NOTICIA' })
], Noticia);
