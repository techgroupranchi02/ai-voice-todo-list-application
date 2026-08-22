import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = 'john.doe@example.com';
      mockUser.password = hashedPassword;

      jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser);
      
      const result = await authService.register(createUserDto);
      
      expect(result).toEqual({
        success: true,
        data: {
          userId: 1,
          message: 'User registered successfully.',
        },
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

      jest.spyOn(userRepository, 'createUser').mockRejectedValue(new ConflictException('User with this email already exists'));
      
      await expect(authService.register(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'createUser').mockRejectedValue(new InternalServerErrorException('Error creating user'));
      
      await expect(authService.register(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUser', () => {
    it('should validate user and return user object when credentials are correct', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = email;
      mockUser.password = hashedPassword;

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      
      const result = await authService.validateUser(email, password);
      
      expect(result).toEqual({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: email,
      });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(undefined);
      
      await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = email;
      mockUser.password = hashedPassword;

      jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      
      await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should generate JWT token for valid user', async () => {
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = 'john.doe@example.com';

      const payload = { email: mockUser.email, sub: mockUser.id };
      const token = 'mock-jwt-token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      
      const result = await authService.login(mockUser);
      
      expect(result).toEqual({
        success: true,
        data: {
          accessToken: token,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;
      
      const mockUser = new User();
      mockUser.id = userId;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = 'john.doe@example.com';

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      
      const result = await authService.getProfile(userId);
      
      expect(result).toEqual({
        success: true,
        data: {
          id: userId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException when user not found', async () => {
      const userId = 999;
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(undefined);
      
      await expect(authService.getProfile(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});