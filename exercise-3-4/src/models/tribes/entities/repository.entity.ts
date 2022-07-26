import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Metrics } from './metrics.entity';
import { Tribe } from './tribe.entity';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn()
  id_repository: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 1 })
  state: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  create_time: Date;

  @Column({ length: 1, default: 'A' })
  status: string;

  @ManyToOne(() => Tribe, (tribe) => tribe.repositories)
  @JoinColumn({ name: 'id_tribe' })
  tribe: Tribe;

  @OneToMany(() => Metrics, (metrics) => metrics.repository)
  metrics: Metrics[];
}
