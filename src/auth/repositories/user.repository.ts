import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, firstName, lastName, password } = createUserDto;

    try {
      const user = this.create({
        email,
        firstName,
        lastName,
        password,
      });

      return await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findUserById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    Object.assign(user, updateData);
    return await this.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}