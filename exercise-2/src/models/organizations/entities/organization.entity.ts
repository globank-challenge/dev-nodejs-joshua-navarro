import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id_organization: number;

  @Column()
  name: string;

  @Column({ default: 1 })
  status: number;
}
