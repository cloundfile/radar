"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VagasController = void 0;
const VagasRep_1 = require("../repository/VagasRep");
const data_source_1 = require("../data-source");
class VagasController {
    async create(req, res) {
        const { cargo, quantidade, requisitos, cidadeId } = req.body;
        if (!cargo || !quantidade || !requisitos || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        try {
            const unique = await VagasRep_1.VagaRep.findOneBy({ cargo, cidadeId });
            if (unique) {
                return res.status(400).json({ message: 'Job already registered for city.' });
            }
            const seqResult = await data_source_1.AppDataSource.query(`SELECT SEQ_VAGA.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = seqResult[0].SEQ;
            const vaga = VagasRep_1.VagaRep.create({
                seq: nextSeq,
                cargo,
                quantidade,
                requisitos,
                cidadeId
            });
            await VagasRep_1.VagaRep.save(vaga);
            return res.status(201).json('Registered successfully!');
        }
        catch (error) {
            console.error("Creating job error:", error);
            return res.status(500).json({ message: 'Creating error', error });
        }
        finally {
            console.log('Vaga registrada com sucesso!');
        }
    }
    async update(req, res) {
        const { seq, cargo, quantidade, requisitos, cidadeId } = req.body;
        if (!seq || !cargo || !quantidade || !requisitos || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        try {
            const vaga = await VagasRep_1.VagaRep.findOne({ where: { seq } });
            if (!vaga) {
                return res.status(404).json({ message: "Not found." });
            }
            vaga.cargo = cargo;
            vaga.quantidade = quantidade;
            vaga.requisitos = requisitos;
            vaga.cidadeId = cidadeId;
            await VagasRep_1.VagaRep.save(vaga);
            return res.status(200).json('Updated successfully!');
        }
        catch (error) {
            console.error("Error updating job:", error);
            return res.status(500).json({ message: "Error updating job", error });
        }
        finally {
            console.log("Vaga atualizada.");
        }
    }
    async delete(req, res) {
        try {
            const seq = Number(req.params.seq);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }
            const vaga = await VagasRep_1.VagaRep.findOne({ where: { seq } });
            if (!vaga) {
                return res.status(404).json({ message: "Not found." });
            }
            await VagasRep_1.VagaRep.delete({ seq });
            return res.status(200).json({ message: "Successfully deleted." });
        }
        catch (error) {
            console.error("Error deleting job:", error);
            return res.status(500).json({ message: "Error deleting job", error });
        }
    }
    async findall(req, res) {
        try {
            const cidadeId = Number(req.query.cidade);
            if (isNaN(cidadeId)) {
                return res.status(400).json({ message: "Invalid or missing 'cidade' parameter." });
            }
            const vagas = await VagasRep_1.VagaRep.find({
                relations: ['cidade'],
                where: { cidadeId },
                order: { cargo: 'ASC' }
            });
            if (!vagas || vagas.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }
            return res.json(vagas);
        }
        catch (error) {
            console.error("Error fetching jobs:", error);
            return res.status(500).json({ message: "Error fetching jobs", error });
        }
    }
}
exports.VagasController = VagasController;
