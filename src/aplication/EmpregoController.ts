import { EmpregoRep } from '../repository/EmpregoRep';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { IsNull } from 'typeorm';

export class EmpregoController {
    async create(req: Request, res: Response) {
        const { cargo, quantidade, requisitos, servicoId, cidadeId } = req.body;

        if (!cargo || !quantidade || !requisitos || !servicoId || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }

        try {
            const unique = await EmpregoRep.findOneBy({ cargo, cidadeId });
            if (unique) {
                return res.status(400).json({ message: 'Job already registered for city.' });
            }

            const seqResult = await AppDataSource.query(`SELECT SEQ_EMPREGO.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = seqResult[0].SEQ;

            const emprego = cidadeId.create({
                seq: nextSeq,
                cargo,
                quantidade,
                requisitos,
                cidadeId,
                servicoId
            });

            await EmpregoRep.save(emprego);
            return res.status(201).json('Registered successfully!');
        } catch (error) {
            console.error("Creating job error:", error);
            return res.status(500).json({ message: 'Creating error', error });
        } finally {
            console.log('Vaga registrada com sucesso!');
        }
    }

    async update(req: Request, res: Response) {
        const { seq, cargo, quantidade, requisitos, fechada, servicoId, cidadeId } = req.body;

        if (!seq || !cargo || !quantidade || !requisitos || !servicoId || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }

        try {
            const emprego = await cidadeId.findOne({ where: { seq } });

            if (!emprego) {
                return res.status(404).json({ message: "Not found." });
            }

            if(cargo)      emprego.cargo = cargo;
            if(quantidade) emprego.quantidade  = quantidade;
            if(requisitos) emprego.requisitos  = requisitos;
            if(fechada)    emprego.fechada     = fechada;
            if(cidadeId)   emprego.cidadeId    = cidadeId;
            if(servicoId)  emprego.servicoId   = servicoId;

            await EmpregoRep.save(emprego);
            return res.status(200).json('Updated successfully!');
        } catch (error) {
            console.error("Error updating job:", error);
            return res.status(500).json({ message: "Error updating job", error });
        } finally {
            console.log("Vaga atualizada.");
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const seq = Number(req.params.seq);

            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }

            const vaga = await EmpregoRep.findOne({ where: { seq } });

            if (!vaga) {
                return res.status(404).json({ message: "Not found." });
            }

            await EmpregoRep.delete({ seq });
            return res.status(200).json({ message: "Successfully deleted." });
        } catch (error) {
            console.error("Error deleting job:", error);
            return res.status(500).json({ message: "Error deleting job", error });
        }
    }

    async findall(req: Request, res: Response) {
        try {
            const cidadeId  = Number(req.query.cidade);
            const servicoId = Number(req.query.servico);

            if (isNaN(cidadeId) || isNaN(servicoId)) {
                return res.status(400).json({ message: "Invalid or missing 'cidade' or 'servico' parameter." });
            }
            
            const emprego = await EmpregoRep.find({
                relations: ['cidade', 'servico'],
                where: { cidadeId, servicoId, fechada: IsNull() },
                order: { seq: 'ASC' }
            });

            if (!emprego || emprego.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }

            return res.json(emprego);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return res.status(500).json({ message: "Error fetching jobs", error });
        }
    }
}