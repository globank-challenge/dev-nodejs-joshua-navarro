import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Organization } from './organization.entity';
import { Repository } from './repository.entity';

@Entity()
export class Tribe {
  @PrimaryGeneratedColumn()
  id_tribe: number;

  @Column({ length: 50 })
  name: string;

  @Column({ default: 1 })
  status: number;

  @ManyToOne(() => Organization, (organization) => organization.tribes)
  @JoinColumn({ name: 'id_organization' })
  organization: Organization;

  @OneToMany(() => Repository, (repository) => repository.tribe)
  repositories: Repository[];
}
