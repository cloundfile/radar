import { AppDataSource } from '../data-source';
import { Cidade } from '../domain/Cidade';

export const CidadeRep = AppDataSource.getRepository(Cidade);