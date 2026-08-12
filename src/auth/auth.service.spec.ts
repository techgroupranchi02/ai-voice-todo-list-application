// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
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

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
      });
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');
      
      const result = await service.register(createUserDto);
      
      expect(result).toEqual({
        success: true,
        data: {
          userId: 1,
          message: 'User registered successfully.',
          accessToken: 'jwtToken',
        },
      });
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({
        id: 1,
        ...createUserDto,
        password: 'hashedPassword',
      });
      
      await expect(service.register(createUserDto)).rejects.toThrow('An account with this email already exists.');
    });
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      
      const result = await service.validateUser('test@example.com', 'password123');
      
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
      });
    });
  });
});