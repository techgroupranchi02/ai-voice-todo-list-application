import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUser: User;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    
    mockUser = new User();
    mockUser.id = 1;
    mockUser.firstName = 'John';
    mockUser.lastName = 'Doe';
    mockUser.email = 'john.doe@example.com';
    mockUser.password = await bcrypt.hash('password123', 10);
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await userRepository.createUser(createUserDto);
      expect(result).toBe(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValue({ code: '23505' });

      await expect(userRepository.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(userRepository.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.email = 'john.doe@example.com';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userRepository.findUserByEmail('john.doe@example.com');
      expect(result).toBe(mockUser);
    });

    it('should return undefined when user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = await userRepository.findUserByEmail('nonexistent@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('findUserById', () => {
    it('should return user by id', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await userRepository.findUserById(1);
      expect(result).toBe(mockUser);
    });

    it('should return undefined when user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = await userRepository.findUserById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      const userData = { firstName: 'Jane' };
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({ ...mockUser, ...userData });

      const result = await userRepository.updateUser(1, userData);
      expect(result.firstName).toBe('Jane');
    });

    it('should throw InternalServerErrorException when user not found', async () => {
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(undefined);

      await expect(userRepository.updateUser(999, { firstName: 'Jane' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockResult = { affected: 1 };
      
      jest.spyOn(userRepository, 'delete').mockResolvedValue(mockResult);

      await expect(userRepository.deleteUser(1)).resolves.not.toThrow();
    });

    it('should throw InternalServerErrorException when user not found', async () => {
      const mockResult = { affected: 0 };
      
      jest.spyOn(userRepository, 'delete').mockResolvedValue(mockResult);

      await expect(userRepository.deleteUser(999)).rejects.toThrow(InternalServerErrorException);
    });
  });
});