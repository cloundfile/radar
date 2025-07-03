import { AppDataSource } from '../data-source';
import { Emprego } from '../domain/Emprego';

export const EmpregoRep = AppDataSource.getRepository(Emprego);