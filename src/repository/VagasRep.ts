import { AppDataSource } from '../data-source';
import { Vagas } from '../domain/Vagas';

export const VagaRep = AppDataSource.getRepository(Vagas);