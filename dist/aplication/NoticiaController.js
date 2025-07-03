"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticiasController = void 0;
const NoticiaRep_1 = require("../repository/NoticiaRep");
const data_source_1 = require("../data-source");
class NoticiasController {
    async create(req, res) {
        const { title, thumbnail, description, weblink, cidadeId } = req.body;
        if (!title || !thumbnail || !description || !weblink || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        try {
            const unique = await NoticiaRep_1.NoticiaRep.findOneBy({ title: title });
            if (unique) {
                return res.status(400).json({ message: 'News already registered for city.' });
            }
            const seqResult = await data_source_1.AppDataSource.query(`SELECT SEQ_NOTICIA.NEXTVAL AS SEQ FROM DUAL`);
            const nextSeq = seqResult[0].SEQ;
            const noticia = NoticiaRep_1.NoticiaRep.create({
                seq: nextSeq,
                title,
                weblink,
                thumbnail,
                description,
                cidadeId: cidadeId
            });
            await NoticiaRep_1.NoticiaRep.save(noticia);
            return res.status(201).json('Registered successfully!');
        }
        catch (error) {
            console.error("Creating user error:", error);
            return res.status(500).json({ message: 'Creating error', error: error });
        }
        finally {
            console.log('Registered successfully!');
        }
    }
    async update(req, res) {
        const { seq, title, thumbnail, description, weblink, cidadeId } = req.body;
        if (!seq || !title || !thumbnail || !description || !weblink || !cidadeId) {
            return res.status(400).json({ message: "Fields with * required." });
        }
        try {
            const noticia = await NoticiaRep_1.NoticiaRep.findOne({
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
            await NoticiaRep_1.NoticiaRep.save(noticia);
            return res.status(200).json('Updated successfully!');
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
            const noticia = await NoticiaRep_1.NoticiaRep.findOne({ where: { seq } });
            if (!noticia) {
                return res.status(404).json({ message: "Not found." });
            }
            await NoticiaRep_1.NoticiaRep.delete({ seq: Number(seq) });
            return res.status(200).json({ message: "Successfully deleted." });
        }
        catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Error deleting user", error: error });
        }
    }
    async findall(req, res) {
        try {
            const seq = Number(req.query.cidade);
            if (isNaN(seq)) {
                return res.status(400).json({ message: "Invalid or missing 'cidade' parameter." });
            }
            const noticias = await NoticiaRep_1.NoticiaRep.find({
                relations: ['cidade'],
                where: { cidadeId: seq },
                order: { publish: 'ASC' }
            });
            if (!noticias || noticias.length === 0) {
                return res.status(404).json({ message: "No records found." });
            }
            return res.json(noticias);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Error fetching news", error: error });
        }
    }
}
exports.NoticiasController = NoticiasController;
