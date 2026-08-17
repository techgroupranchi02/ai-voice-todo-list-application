import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const mockUserRepository = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
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
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: registerDto.email,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.createUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        userId: '1',
        message: 'User registered successfully.',
      });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userRepository.createUser).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue({ id: 1, email: 'test@example.com' });

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user and return access token', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: '$2b$10$hash', // Mock hashed password
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
      });
      expect(userRepository.findUserByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: '$2b$10$wronghash',
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should validate user and return user object if valid', async () => {
      const mockUser = {
        id: 1,
        email,
        password: '$2b$10$hash',
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(email, password);

      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const mockUser = {
        id: 1,
        email,
        password: '$2b$10$wronghash',
      };

      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });
  });
});