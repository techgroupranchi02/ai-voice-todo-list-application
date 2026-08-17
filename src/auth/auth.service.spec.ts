import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock the user repository
const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

// Mock the jwt service
const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

// Mock the config service
const mockConfigService = {
  get: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

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
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserRepository.create.mockResolvedValue({
        id: 1,
        ...registerDto,
        password: hashedPassword,
      });

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
    });

    it('should throw an error if user already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      await expect(authService.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      });

      mockJwtService.sign.mockReturnValue('access-token');
      mockJwtService.sign.mockReturnValue('refresh-token');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('wrongpassword', 10);
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      });

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should validate user and return user without password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
      });

      const result = await authService.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      });

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      mockConfigService.get.mockReturnValue('secret-key');
      mockJwtService.sign.mockReturnValue('access-token');
      mockJwtService.sign.mockReturnValue('refresh-token');

      const result = await authService.generateTokens({ id: 1, email: 'test@example.com' });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('getRefreshToken', () => {
    it('should generate refresh token with correct payload', async () => {
      mockConfigService.get.mockReturnValue('secret-key');
      mockJwtService.sign.mockReturnValue('refresh-token');

      const result = await authService.getRefreshToken({ id: 1, email: 'test@example.com' });

      expect(result).toBe('refresh-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com' },
        { expiresIn: '7d' },
      );
    });
  });

  describe('getAccessToken', () => {
    it('should generate access token with correct payload', async () => {
      mockConfigService.get.mockReturnValue('secret-key');
      mockJwtService.sign.mockReturnValue('access-token');

      const result = await authService.getAccessToken({ id: 1, email: 'test@example.com' });

      expect(result).toBe('access-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: 1, email: 'test@example.com' },
        { expiresIn: '1h' },
      );
    });
  });
});