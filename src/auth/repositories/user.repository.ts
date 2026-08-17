import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    try {
      const user = this.create({
        firstName,
        lastName,
        email,
        password,
      });

      await this.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('An account with this email already exists.');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}