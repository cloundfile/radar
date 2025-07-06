import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cidade } from './Cidade';

@Entity({ name: 'EMPREGO' })
export class Emprego {
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

    @ManyToOne(() => Cidade)
    @JoinColumn({ name: 'CIDADE', referencedColumnName: 'seq' })
    cidade: Cidade;

    @UpdateDateColumn({ name: 'FECHADA', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechada: Date;
    
    @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    publish: Date;
}