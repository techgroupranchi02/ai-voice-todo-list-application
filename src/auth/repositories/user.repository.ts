import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    const saltRounds = process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS) : 12;
    
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = await bcrypt.hash(password, saltRounds);

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
}