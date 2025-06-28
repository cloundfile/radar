import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn,  CreateDateColumn, } from 'typeorm';

@Entity('CIDADE')
export class Cidade {

  @PrimaryColumn({ name: 'SEQ', type: 'number', precision: 19, scale: 2 })
  seq: number;

  @Column({ name: 'DESCRICAO', type: 'varchar2', length: 255 })
  descricao: string;

  @Column({ name: 'DOMINIO', type: 'varchar2', length: 255 })
  dominio: string;
}
