import { AppDataSource } from '../data-source';
import { Noticia } from '../domain/Noticia';

export const NoticiaRep = AppDataSource.getRepository(Noticia);