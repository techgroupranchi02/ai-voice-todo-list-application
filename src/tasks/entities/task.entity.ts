import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskPriority {
  LOW = 3,
  MEDIUM = 2,
  HIGH = 1,
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('bigserial')
  id: number;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  dueDate: Date;

  @Column({
    type: 'integer',
    nullable: false,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  category: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  completed: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}