import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
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
      password: 'securePassword123',
    };

    it('should create a user successfully', async () => {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password: hashedPassword,
      });
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await userRepository.createUser(createUserDto);
      
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
      }));
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(userRepository.createUser(createUserDto))
        .rejects
        .toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other database errors', async () => {
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(userRepository.createUser(createUserDto))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = { id: 1, email: 'john.doe@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findUserByEmail('john.doe@example.com');
      
      expect(result).toEqual(mockUser);
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
      const mockUser = { id: 1, email: 'john.doe@example.com' } as User;
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findUserById(1);
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findUserById(999);
      
      expect(result).toBeNull();
    });
  });
});