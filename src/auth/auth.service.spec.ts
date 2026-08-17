import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
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
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await authService.validateUser(
        mockUser.email,
        password,
      );

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      });
      expect(usersService.findOne).toHaveBeenCalledWith({ email: mockUser.email });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistent@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const password = 'password123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      mockUsersService.findOne.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await expect(
        authService.validateUser(mockUser.email, wrongPassword),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access and refresh tokens for valid user', async () => {
      const user = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      };

      const accessToken = 'access-token-123';
      const refreshToken = 'refresh-token-123';

      mockJwtService.sign.mockReturnValueOnce(accessToken);
      mockJwtService.sign.mockReturnValueOnce(refreshToken);

      const result = await authService.login(user);

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { expiresIn: '15m' },
      );
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { expiresIn: '7d' },
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return the user without password', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const createdUser = {
        ...mockUser,
        id: 2,
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      mockUsersService.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(result).toEqual({
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      });
      expect(usersService.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
    });

    it('should throw BadRequestException if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new access token with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = { sub: 1, email: 'test@example.com' };
      const newAccessToken = 'new-access-token';

      mockJwtService.verify.mockReturnValue(payload);
      mockJwtService.sign.mockReturnValue(newAccessToken);

      const result = await authService.refreshToken(refreshToken);

      expect(result).toEqual({ access_token: newAccessToken });
      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: payload.sub, email: payload.email },
        { expiresIn: '15m' },
      );
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile for valid JWT token', async () => {
      const token = 'valid-jwt-token';
      const payload = { sub: 1, email: 'test@example.com' };
      const user = {
        id: payload.sub,
        email: payload.email,
        firstName: 'Test',
        lastName: 'User',
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await authService.getProfile(token);

      expect(result).toEqual({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(usersService.findOne).toHaveBeenCalledWith({ id: payload.sub });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalid-jwt-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.getProfile(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});