import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
    it('should register a user and return success response', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockResult = {
        userId: 1,
        message: 'User registered successfully.',
      };

      mockAuthService.register.mockResolvedValue(mockResult);

      const result = await controller.register(createUserDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login a user and return tokens', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const mockResult = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      const result = await controller.login(loginUserDto);

      expect(result).toEqual({
        success: true,
        data: mockResult,
      });
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });
});