import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: '$2b$10$hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    createUser: jest.fn(),
    findUserByEmail: jest.fn(),
    findUserById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockUserRepository.createUser.mockResolvedValue(mockUser);

      const result = await authService.register(createUserDto);

      expect(result).toEqual({
        userId: mockUser.id,
        message: 'User registered successfully.',
      });
      expect(userRepository.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockUserRepository.createUser.mockRejectedValue(
        new ConflictException('An account with this email already exists.'),
      );

      await expect(authService.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully and return tokens', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockUserWithPassword = { ...mockUser, comparePassword: jest.fn() };
      mockUserWithPassword.comparePassword.mockResolvedValue(true);
      
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithPassword);
      mockJwtService.sign.mockReturnValue('mock-access-token');

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-access-token',
      });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(mockUserWithPassword.comparePassword).toHaveBeenCalledWith(loginUserDto.password);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'invalid@example.com',
        password: 'password123',
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };

      const mockUserWithPassword = { ...mockUser, comparePassword: jest.fn() };
      mockUserWithPassword.comparePassword.mockResolvedValue(false);
      
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithPassword);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user and return user object if valid', async () => {
      const mockUserWithPassword = { ...mockUser, comparePassword: jest.fn() };
      mockUserWithPassword.comparePassword.mockResolvedValue(true);
      
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithPassword);

      const result = await authService.validateUser('john.doe@example.com', 'password123');

      expect(result).toEqual(mockUserWithPassword);
    });

    it('should return null for invalid user credentials', async () => {
      const mockUserWithPassword = { ...mockUser, comparePassword: jest.fn() };
      mockUserWithPassword.comparePassword.mockResolvedValue(false);
      
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUserWithPassword);

      const result = await authService.validateUser('john.doe@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      mockUserRepository.findUserById.mockResolvedValue(mockUser);

      const result = await authService.getProfile(1);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(authService.getProfile(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});