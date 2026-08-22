import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../../auth/entities/user.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'bigint', nullable: false })
  @IsNotEmpty()
  ownerId: number;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}