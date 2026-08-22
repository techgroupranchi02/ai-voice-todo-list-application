import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional, IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { User } from '../../auth/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'bigint', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  title: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  dueDate: Date;

  @Column({ type: 'int', nullable: false, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  category: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}