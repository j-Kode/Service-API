import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  versionNo: number;

  @Column('text')
  description: string;

  @ManyToOne(() => Service, (service) => service.versions)
  @JoinColumn()
  service: Service;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
