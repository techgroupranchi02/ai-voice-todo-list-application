import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    // Get BCRYPT_ROUNDS from environment with default value of 12
    const bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    
    // Validate BCRYPT_ROUNDS is within acceptable range (10-15)
    if (bcryptRounds < 10 || bcryptRounds > 15) {
      throw new InternalServerErrorException('BCRYPT_ROUNDS must be between 10 and 15');
    }

    const salt = await bcrypt.genSalt(bcryptRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    try {
      return await this.save(user);
    } catch (error) {
      // Proper error handling - log sanitized error
      if (error.code === '23505') {
        throw new ConflictException('An account with this email already exists.');
      }
      // Log the actual error for debugging but don't expose it to client
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }
}