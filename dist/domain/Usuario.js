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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const Role_1 = require("./Role");
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'SEQ', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], Usuario.prototype, "seq", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'USERNAME', type: 'varchar2', length: 255, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'PASSWORD', type: 'varchar2', length: 255, nullable: false }),
    __metadata("design:type", String)
], Usuario.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'TELEFONE', type: 'number', precision: 12, nullable: false }),
    __metadata("design:type", Number)
], Usuario.prototype, "telefone", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'PUBLISH',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Usuario.prototype, "publish", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Role_1.Role),
    (0, typeorm_1.JoinTable)({
        name: 'USUARIOS_ROLES',
        joinColumn: { name: 'USUARIO_SEQ', referencedColumnName: 'seq' },
        inverseJoinColumn: { name: 'ROLE_SEQ', referencedColumnName: 'seq' }
    }),
    __metadata("design:type", Array)
], Usuario.prototype, "roles", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)('USUARIO')
], Usuario);
