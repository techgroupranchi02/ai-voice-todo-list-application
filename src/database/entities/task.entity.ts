import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('bigserial')
  id: bigint;

  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'bigint' })
  userId: bigint;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'int', default: 0 })
  priority: number;

  @ManyToOne(() => Category, category => category.tasks)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'bigint', nullable: true })
  categoryId: bigint;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}