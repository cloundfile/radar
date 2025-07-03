import { AppDataSource } from '../data-source';
import { Servico } from '../domain/Servico';

export const ServicoRep = AppDataSource.getRepository(Servico);