import { Column, Double, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Repository } from './repository.entity';

@Entity()
export class Metrics {
  @PrimaryColumn()
  id_repository: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  coverage: number;

  @Column()
  bugs: number;

  @Column()
  vulnerabilities: number;

  @Column()
  hotspot: number;

  @Column()
  code_smells: number;

  @OneToOne(() => Repository, (repository) => repository.metrics)
  @JoinColumn({ name: 'id_repository' })
  repository: Repository;
}
