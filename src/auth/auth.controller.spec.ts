import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
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

      const mockResult = {
        success: true,
        data: {
          userId: 1,
          message: 'User registered successfully.',
        },
      };

      jest.spyOn(authService, 'register').mockResolvedValue(mockResult);
      
      const result = await controller.register(createUserDto);
      
      expect(result).toEqual(mockResult);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'register').mockRejectedValue(new ConflictException('User with this email already exists'));
      
      await expect(controller.register(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'register').mockRejectedValue(new InternalServerErrorException('Error creating user'));
      
      await expect(controller.register(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should login user and return access token', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      const mockUser = new User();
      mockUser.id = 1;
      mockUser.firstName = 'John';
      mockUser.lastName = 'Doe';
      mockUser.email = email;

      const mockResult = {
        success: true,
        data: {
          accessToken: 'mock-jwt-token',
        },
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockResult);
      
      const result = await controller.login({ email, password });
      
      expect(result).toEqual(mockResult);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const email = 'john.doe@example.com';
      const password = 'password123';

      jest.spyOn(authService, 'validateUser').mockRejectedValue(new UnauthorizedException('Invalid credentials'));
      
      await expect(controller.login({ email, password })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;

      const mockResult = {
        success: true,
        data: {
          id: userId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
      };

      jest.spyOn(authService, 'getProfile').mockResolvedValue(mockResult);
      
      const result = await controller.getProfile(userId);
      
      expect(result).toEqual(mockResult);
      expect(authService.getProfile).toHaveBeenCalledWith(userId);
    });

    it('should throw InternalServerErrorException when user not found', async () => {
      const userId = 999;

      jest.spyOn(authService, 'getProfile').mockRejectedValue(new InternalServerErrorException('User not found'));
      
      await expect(controller.getProfile(userId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});