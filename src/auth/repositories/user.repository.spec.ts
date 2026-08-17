import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserRepository', () => {
  let repository: UserRepository;
  let mockUser: User;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    mockUser = new User();
    mockUser.id = 1;
    mockUser.firstName = 'John';
    mockUser.lastName = 'Doe';
    mockUser.email = 'john.doe@example.com';
    mockUser.password = 'hashedPassword';
    mockUser.createdAt = new Date();
    mockUser.updatedAt = new Date();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await repository.createUser(createUserDto);
      
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue({ code: '23505' });

      await expect(repository.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      mockUserRepository.save.mockRejectedValue({ code: 'OTHER_ERROR' });

      await expect(repository.createUser(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail('john.doe@example.com');
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
    });

    it('should return undefined when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await repository.findUserByEmail('nonexistent@example.com');
      
      expect(result).toBeUndefined();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.findUserById(1);
      
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return undefined when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      const result = await repository.findUserById(999);
      
      expect(result).toBeUndefined();
    });
  });
});