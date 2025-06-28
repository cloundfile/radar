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
exports.UsuarioRole = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Role_1 = require("./Role");
let UsuarioRole = class UsuarioRole {
};
exports.UsuarioRole = UsuarioRole;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'USUARIO_SEQ', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], UsuarioRole.prototype, "usuarioSeq", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'ROLE_SEQ', type: 'number', precision: 19, scale: 2 }),
    __metadata("design:type", Number)
], UsuarioRole.prototype, "roleSeq", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'PUBLISH',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], UsuarioRole.prototype, "publish", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario),
    (0, typeorm_1.JoinColumn)({ name: 'USUARIO_SEQ', referencedColumnName: 'seq' }),
    __metadata("design:type", Usuario_1.Usuario)
], UsuarioRole.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Role_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'ROLE_SEQ', referencedColumnName: 'seq' }),
    __metadata("design:type", Role_1.Role)
], UsuarioRole.prototype, "role", void 0);
exports.UsuarioRole = UsuarioRole = __decorate([
    (0, typeorm_1.Entity)('USUARIOS_ROLES')
], UsuarioRole);
