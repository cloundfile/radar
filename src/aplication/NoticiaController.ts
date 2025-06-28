import { NoticiaRep } from '../repository/NoticiasRep';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';

export class NoticiasController {
    async create(req: Request, res: Response) {
        const { title, thumbnail, description, weblink, cidadeId } = req.body;
        if (!title || !thumbnail || !description || !weblink || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        try {
            const unique = await NoticiaRep.findOneBy({ title: title });
            if (unique) {
                return res.status(400).json({ message: 'News already registered for city.' });
            }

            const seqResult = await AppDataSource.query(`SELECT SEQ_NOTICIA.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = seqResult[0].SEQ;

            const noticia = NoticiaRep.create({
                seq: nextSeq,
                title,
                weblink,
                thumbnail,
                description,
                cidadeId: cidadeId
            });

            await NoticiaRep.save(noticia);
            return res.status(201).json('Registered successfully!');
        } catch (error) {
            console.error("Creating user error:", error);
            return res.status(500).json({ message: 'Creating error', error: error });
        } finally {
            console.log('Registered successfully!');
        }
    }

    async update(req: Request, res: Response) {
        const { seq, title, thumbnail, description, weblink, cidadeId } = req.body;
        if (!seq || !title || !thumbnail || !description || !weblink || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }

        try {
            const noticia = await NoticiaRep.findOne({
                where: { seq }
            });

            if (!noticia) {
                return res.status(404).json({ message: "Not found." });
            }
            noticia.title = title;
            noticia.weblink = weblink;
            noticia.thumbnail = thumbnail;
            noticia.description = description;
            noticia.cidadeId = cidadeId;
            await NoticiaRep.save(noticia);

            return res.status(200).json('Updated successfully!');

        } catch (error) {
            return res.status(500).json({ message: "Error updating user", error: error });
        } finally {
            console.log("User update completed.");
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const seq = Number(req.params.seq);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'seq' parameter." });
            }

            const noticia = await NoticiaRep.findOne({ where: { seq } });

            if (!noticia) {
                return res.status(404).json({ message: "Not found." });
            }

            await NoticiaRep.delete({ seq: Number(seq) });

            return res.status(200).json({ message: "Successfully deleted." });

        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Error deleting user", error: error });
        }
    }

    async findall(req: Request, res: Response) {
        try {
            const seq = Number(req.query.cidade);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'cidade' parameter." });
            }

            const noticias = await NoticiaRep.find({
                relations: ['cidade'],
                where: { cidadeId: seq },
                order: { publish: 'ASC' }
            });

            if (!noticias || noticias.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }

            return res.json(noticias);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching news", error: error });
        }
    }
}