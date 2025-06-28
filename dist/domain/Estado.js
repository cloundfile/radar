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
exports.Estado = void 0;
const typeorm_1 = require("typeorm");
let Estado = class Estado {
};
exports.Estado = Estado;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'SEQ', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], Estado.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'SIGLA', type: 'varchar2', length: 2 }),
    __metadata("design:type", String)
], Estado.prototype, "sigla", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'DESCRICAO', type: 'varchar2', length: 255 }),
    __metadata("design:type", String)
], Estado.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Estado.prototype, "publish", void 0);
exports.Estado = Estado = __decorate([
    (0, typeorm_1.Entity)('ESTADO')
], Estado);
