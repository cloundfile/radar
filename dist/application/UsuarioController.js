"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioRep_1 = require("../repository/UsuarioRep");
const RolesRep_1 = require("../repository/RolesRep");
const data_source_1 = require("../data-source");
const bcrypt = require('bcryptjs');
class UsuarioController {
    async create(req, res) {
        const { username, password, telefone, roles } = req.body;
        if (!username || !password || !telefone || !roles) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        try {
            const existing = await UsuarioRep_1.UsuarioRep.findOneBy({ username: String(username) });
            if (existing) {
                return res.status(400).json({ message: 'Username unavailable.' });
            }
            const seqResult = await data_source_1.AppDataSource.query(`SELECT SEQ_USUARIO.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = Number(seqResult?.[0]?.SEQ);
            if (!nextSeq) {
                return res.status(500).json({ message: "Error retrieving sequence." });
            }
            const roleEntities = await Promise.all(roles.map(async (item) => {
                const role = await RolesRep_1.RolesRep.findOneBy({ seq: item.id });
                if (!role)
                    throw new Error(`Role ID ${item.id} not found`);
                return role;
            }));
            const usuario = UsuarioRep_1.UsuarioRep.create({
                seq: nextSeq,
                username,
                password: hashedPassword,
                telefone,
                roles: roleEntities,
            });
            await UsuarioRep_1.UsuarioRep.save(usuario);
            return res.status(201).json({
                username: usuario.username,
                roles: usuario.roles.map(role => role.descricao),
            });
        }
        catch (error) {
            console.error("Creating user error:", error);
            return res.status(500).json({ message: 'Creating error', error: error });
        }
        finally {
            console.log('User creation request processed.');
        }
    }
    async update(req, res) {
        const { seq, username, password, telefone, roles } = req.body;
        if (!seq || !username || !roles || !Array.isArray(roles)) {
            return res.status(400).json({ message: "Fields with * required and roles must be an array." });
        }
        try {
            const usuario = await UsuarioRep_1.UsuarioRep.findOne({
                where: { seq },
                relations: ['roles'],
            });
            if (!usuario) {
                return res.status(404).json({ message: "User not found." });
            }
            usuario.username = username;
            if (telefone)
                usuario.telefone = telefone;
            if (password) {
                usuario.password = bcrypt.hashSync(password, 10);
            }
            const roleEntities = await Promise.all(roles.map(async (r) => {
                const role = await RolesRep_1.RolesRep.findOneBy({ seq: r.id });
                if (!role)
                    throw new Error(`Role with ID ${r.id} not found.`);
                return role;
            }));
            usuario.roles = roleEntities;
            await UsuarioRep_1.UsuarioRep.save(usuario);
            return res.status(200).json({
                seq: usuario.seq,
                username: usuario.username,
                telefone: usuario.telefone,
                roles: usuario.roles.map(role => role.descricao),
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Error updating user", error: error });
        }
        finally {
            console.log("User update completed.");
        }
    }
    async delete(req, res) {
        try {
            const seq = Number(req.params.seq);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }
            const seqNum = Number(seq);
            if (isNaN(seqNum)) {
                return res.status(400).json({ message: "Invalid ID format." });
            }
            const usuario = await UsuarioRep_1.UsuarioRep.findOne({ where: { seq } });
            if (!usuario) {
                return res.status(404).json({ message: "User not found." });
            }
            await UsuarioRep_1.UsuarioRep.delete({ seq: seqNum });
            return res.status(200).json({ message: "Successfully deleted." });
        }
        catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Error deleting user", error: error });
        }
    }
    async findall(req, res) {
        try {
            const usuarios = await UsuarioRep_1.UsuarioRep.find({
                relations: ['roles'],
                order: { username: 'ASC' },
            });
            if (!usuarios || usuarios.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }
            const response = usuarios.map(usuario => ({
                seq: usuario.seq,
                username: usuario.username,
                roles: usuario.roles ? usuario.roles.map(role => role.descricao) : []
            }));
            return res.json(response);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching users", error: error });
        }
    }
}
exports.UsuarioController = UsuarioController;
