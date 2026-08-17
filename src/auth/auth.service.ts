import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ userId: string; message: string }> {
    const { email, password, firstName, lastName } = registerDto;

    // Check if email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    try {
      const savedUser = await this.usersRepository.save(newUser);
      return {
        userId: savedUser.id,
        message: 'User registered successfully.',
      };
    } catch (error) {
      throw new BadRequestException('Error registering user.');
    }
  }
}