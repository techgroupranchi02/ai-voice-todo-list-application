import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('bigserial')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @MaxLength(255)
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const configService = new ConfigService();
    const saltRounds = parseInt(configService.get('BCRYPT_ROUNDS') || '10', 10);
    
    // Validate salt rounds to prevent performance issues
    if (isNaN(saltRounds) || saltRounds < 4 || saltRounds > 31) {
      throw new Error('Invalid BCRYPT_ROUNDS value. Must be between 4 and 31.');
    }

    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}