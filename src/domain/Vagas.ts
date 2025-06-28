import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cidade } from './Cidade';

@Entity({ name: 'VAGAS' })
export class Vagas {
    @PrimaryColumn({ name: 'SEQ', type: 'number' })
    seq: number;    

    @Column({ name: 'CARGO', type: 'varchar', length: 255 })
    cargo: string;

    @Column({ name: 'QUANTIDADE', type: 'number' })
    quantidade: number;     

    @Column({ name: 'REQUISITOS', type: 'clob' })
    requisitos: string;

    @Column({ name: 'CIDADE', type: 'number' })
    cidadeId: number;

    @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    publish: Date;

    @ManyToOne(() => Cidade)
    @JoinColumn({ name: 'CIDADE', referencedColumnName: 'seq' })
    cidade: Cidade;
}