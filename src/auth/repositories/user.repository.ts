import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    try {
      return await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new ConflictException('User not found');
    }

    Object.assign(user, userData);
    return await user.save();
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new ConflictException('User not found');
    }
  }
}