"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleController = void 0;
const UsuarioRep_1 = require("../repository/UsuarioRep");
const RolesRep_1 = require("../repository/RolesRep");
const data_source_1 = require("../data-source");
class RoleController {
    async create(req, res) {
        try {
            const { descricao } = req.body;
            if (!descricao) {
                return res.status(400).json({ message: "Field 'descricao' is required." });
            }
            const seqResult = await data_source_1.AppDataSource.query(`SELECT SEQ_ROLE.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = seqResult[0].SEQ;
            const role = RolesRep_1.RolesRep.create({
                seq: nextSeq,
                descricao
            });
            await RolesRep_1.RolesRep.save(role);
            return res.status(201).json(role);
        }
        catch (error) {
            console.error("Error creating role:", error);
            return res.status(500).json({ message: "Error creating role", error: error });
        }
    }
    async update(req, res) {
        try {
            const { seq, descricao } = req.body;
            if (!seq || !descricao) {
                return res.status(400).json({ message: "Field 'descricao' is required." });
            }
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }
            const role = await RolesRep_1.RolesRep.findOne({ where: { seq } });
            if (!role) {
                return res.status(404).json({ message: `Role with seq ${seq} not found.` });
            }
            role.descricao = descricao;
            await RolesRep_1.RolesRep.save(role);
            return res.json(role);
        }
        catch (error) {
            console.error("Error updating role:", error);
            return res.status(500).json({ message: "Error updating role", error: error });
        }
    }
    async delete(req, res) {
        try {
            const seq = Number(req.params.seq);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }
            const role = await RolesRep_1.RolesRep.findOne({ where: { seq } });
            if (!role) {
                return res.status(404).json({ message: "Role not found." });
            }
            const userWithRole = await UsuarioRep_1.UsuarioRep.createQueryBuilder('usuario')
                .leftJoin('usuario.roles', 'role')
                .where('role.seq = :seq', { seq })
                .getOne();
            if (userWithRole) {
                return res.status(400).json({ message: "You cannot delete a role that is in use." });
            }
            await RolesRep_1.RolesRep.delete({ seq });
            return res.status(200).json({ message: `Role deleted successfully.` });
        }
        catch (error) {
            console.error("Error deleting role:", error);
            return res.status(500).json({ message: "Error deleting role", error: error });
        }
    }
    async findAll(req, res) {
        try {
            const roles = await RolesRep_1.RolesRep.find({
                order: {
                    descricao: 'ASC',
                },
            });
            if (!roles || roles.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }
            return res.json(roles);
        }
        catch (error) {
            console.error("Error fetching roles:", error);
            return res.status(500).json({ message: "Error fetching roles", error: error });
        }
    }
}
exports.RoleController = RoleController;
