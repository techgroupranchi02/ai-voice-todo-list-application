import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock user data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: '$2b$10$examplehashedpassword', // Mock hashed password
  firstName: 'Test',
  lastName: 'User',
};

const mockUserEntity = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword123',
  firstName: 'Test',
  lastName: 'User',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      };

      const hashedPassword = await bcrypt.hash('Password123!', 10);
      
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({
        ...registerDto,
        password: hashedPassword,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      userRepository.save.mockResolvedValue(mockUserEntity);

      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.register(registerDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
        },
        accessToken: 'mock-jwt-token',
      });
    });

    it('should throw an error if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Existing',
        lastName: 'User',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        'User already exists',
      );
    });

    it('should handle bcrypt hash errors', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      };

      userRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Hash error'));

      await expect(authService.register(registerDto)).rejects.toThrow(
        'Hash error',
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully with valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await authService.login(loginDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
        accessToken: 'mock-jwt-token',
      });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      userRepository.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should handle bcrypt compare errors', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Compare error'));

      await expect(authService.login(loginDto)).rejects.toThrow('Compare error');
    });
  });

  describe('validateUser', () => {
    it('should validate user and return user object without password', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        mockUser.email,
        'Password123!',
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
      });
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    it('should return null for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await authService.validateUser(
        mockUser.email,
        'WrongPassword123!',
      );

      expect(result).toBeNull();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token for user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jwtService.sign.mockReturnValue('mock-access-token');

      const result = await authService.generateAccessToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(result).toBe('mock-access-token');
    });

    it('should handle JWT signing errors', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing error');
      });

      await expect(authService.generateAccessToken(user)).rejects.toThrow(
        'JWT signing error',
      );
    });
  });

  describe('getRefreshToken', () => {
    it('should generate refresh token for user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jwtService.sign.mockReturnValue('mock-refresh-token');

      const result = await authService.getRefreshToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: user.id, email: user.email },
        { expiresIn: '7d' },
      );
      expect(result).toBe('mock-refresh-token');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify access token and return payload', async () => {
      const token = 'mock-access-token';
      const payload = { sub: 1, email: 'test@example.com' };

      jwtService.verify.mockReturnValue(payload);

      const result = await authService.verifyAccessToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });

    it('should handle JWT verification errors', async () => {
      const token = 'invalid-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('JWT verification error');
      });

      await expect(authService.verifyAccessToken(token)).rejects.toThrow(
        'JWT verification error',
      );
    });
  });
});