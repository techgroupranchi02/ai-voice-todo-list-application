import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a user successfully', async () => {
      const mockResult = {
        userId: '1',
        message: 'User registered successfully.',
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle conflict error during registration', async () => {
      mockAuthService.register.mockRejectedValue(
        new Error('An account with this email already exists.'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(Error);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login a user successfully', async () => {
      const mockResult = {
        accessToken: 'mock-jwt-token',
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle invalid credentials during login', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow(Error);
    });
  });
});