import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('createUser', () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue({ id: 1, ...createUserDto, password: 'hashedPassword' });

      const result = await userRepository.createUser(createUserDto);
      
      expect(result).toEqual({ id: 1, ...createUserDto, password: 'hashedPassword' });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const error = { code: '23505' };
      mockUserRepository.save.mockRejectedValue(error);

      await expect(userRepository.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const error = new Error('Database error');
      mockUserRepository.save.mockRejectedValue(error);

      await expect(userRepository.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const user = { id: 1, email: 'john.doe@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserByEmail('john.doe@example.com');
      
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      const user = { id: 1, email: 'john.doe@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userRepository.findUserById(1);
      
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserById(999);
      
      expect(result).toBeNull();
    });
  });
});