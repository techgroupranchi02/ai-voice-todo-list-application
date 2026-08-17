import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        password: 'hashedPassword',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        userId: '1',
        message: 'User registered successfully.',
      });
    });

    it('should throw an error if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(
        'An account with this email already exists.'
      );
    });
  });

  describe('validateUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: '$2a$10$hashedPassword',
    };

    it('should validate user credentials correctly', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid credentials', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
    };

    it('should generate a JWT token for valid user', async () => {
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: mockUser.email, sub: mockUser.id });
    });
  });
});