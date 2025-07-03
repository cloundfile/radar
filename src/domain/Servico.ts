import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from './Cidade';

@Entity('SERVICO')
export class Servico {

    @PrimaryColumn({ name: 'SEQ', type: 'number', precision: 19, scale: 2 })
    seq: number;

    @Column({ name: 'TITLE', type: 'varchar2', length: 20 })
    title: string;

    @Column({ name: 'ICONE', type: 'varchar2', length: 50 })
    icone: string;

    @Column({ name: 'CIDADE', type: 'number' })
    cidadeId: number;

    @ManyToOne(() => Cidade)
    @JoinColumn({ name: 'CIDADE', referencedColumnName: 'seq' })
    cidade: Cidade;

    @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    publish: Date;
}