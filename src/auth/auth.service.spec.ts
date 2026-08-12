import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      
      const result = await service.validateUser('test@example.com', 'password');
      
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should return null if credentials are invalid', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      
      const result = await service.validateUser('test@example.com', 'password');
      
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        firstName: 'John',
        lastName: 'Doe',
      };
      
      mockUsersService.findOneByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      
      const result = await service.register(
        'test@example.com',
        'password',
        'John',
        'Doe'
      );
      
      expect(result).toEqual({
        userId: '1',
        message: 'User registered successfully.',
      });
    });

    it('should throw error if user already exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        firstName: 'John',
        lastName: 'Doe',
      };
      
      mockUsersService.findOneByEmail.mockResolvedValue(mockUser);
      
      await expect(
        service.register('test@example.com', 'password', 'John', 'Doe')
      ).rejects.toThrow('An account with this email already exists.');
    });
  });
});