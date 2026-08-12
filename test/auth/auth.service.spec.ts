import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      const mockResult = {
        userId: mockUser.id.toString(),
        message: 'User registered successfully.',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      expect(await service.register(registerDto)).toEqual(mockResult);
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: registerDto.email,
        password: 'hashedPassword',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        'An account with this email already exists.',
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email,
        password: await bcrypt.hash(password, 10),
        firstName: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      expect(await service.validateUser(email, password)).toEqual(mockUser);
    });

    it('should return null if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      expect(await service.validateUser(email, password)).toBeNull();
    });
  });
});