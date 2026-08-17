import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate: Date | null;

  @Column({ type: 'int' })
  priority: number;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number | null;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}