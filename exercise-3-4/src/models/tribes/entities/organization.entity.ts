import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tribe } from './tribe.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id_organization: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => Tribe, (tribe) => tribe.organization)
  tribes: Tribe[];
}
