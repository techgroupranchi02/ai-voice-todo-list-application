import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    mockUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser as any);

      const result = await repository.createUser(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(repository, 'save').mockRejectedValue({ code: '23505' });

      await expect(repository.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Database error'));

      await expect(repository.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail('john.doe@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);

      const result = await repository.findUserById(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      jest.spyOn(repository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'save').mockResolvedValue(mockUser);

      const result = await repository.updateUser(1, { firstName: 'Jane' });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when user not found', async () => {
      jest.spyOn(repository, 'findUserById').mockResolvedValue(null);

      await expect(repository.updateUser(1, { firstName: 'Jane' })).rejects.toThrow(ConflictException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await expect(repository.deleteUser(1)).resolves.not.toThrow();
    });

    it('should throw ConflictException when user not found', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(repository.deleteUser(1)).rejects.toThrow(ConflictException);
    });
  });
});