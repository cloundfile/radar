import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cidade } from './Cidade';

@Entity({ name: 'NOTICIA' })
export class Noticia {
  @PrimaryColumn({ name: 'SEQ', type: 'number' })
  seq: number;

  @Column({ name: 'TITLE', type: 'varchar2', length: 255 })
  title: string;

  @Column({ name: 'WEBLINK', type: 'varchar2', length: 255 })
  weblink: string;

  @Column({ name: 'THUMBNAIL', type: 'varchar2', length: 255, nullable: true })
  thumbnail: string;

  @Column({ name: 'DESCRIPTION', type: 'clob' })
  description: string;

  @Column({ name: 'CIDADE', type: 'number' })
  cidadeId: number;

  @CreateDateColumn({ name: 'PUBLISH', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  publish: Date;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'CIDADE', referencedColumnName: 'seq' })
  cidade: Cidade;
}