import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'team_members',
    joinColumn: {
      name: 'team_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  members: User[];
}