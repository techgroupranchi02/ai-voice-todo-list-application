import { AuthMiddleware } from './auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../auth/services/user.service';
import { Request, Response, NextFunction } from 'express';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userService: UserService;

  const mockRequest = {
    headers: {},
    ip: '127.0.0.1',
  } as Request;

  const mockResponse = {} as Response;

  const mockNextFunction = jest.fn() as NextFunction;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as unknown as JwtService;

    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    userService = {
      findUserById: jest.fn(),
    } as unknown as UserService;

    middleware = new AuthMiddleware(jwtService, configService, userService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should throw UnauthorizedException when no authorization header is provided', async () => {
    await expect(
      middleware.use(mockRequest, mockResponse, mockNextFunction),
    ).rejects.toThrow('Authorization header missing or invalid');
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    mockRequest.headers = { authorization: 'Bearer invalid-token' };
    
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(
      middleware.use(mockRequest, mockResponse, mockNextFunction),
    ).rejects.toThrow('Authentication failed');
  });

  it('should set user on request object when valid token is provided', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    
    mockRequest.headers = { authorization: 'Bearer valid-token' };
    
    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
    jest.spyOn(userService, 'findUserById').mockResolvedValue(mockUser);

    await middleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockRequest.user).toBe(mockUser);
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    mockRequest.headers = { authorization: 'Bearer valid-token' };
    
    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 1 });
    jest.spyOn(userService, 'findUserById').mockResolvedValue(null);

    await expect(
      middleware.use(mockRequest, mockResponse, mockNextFunction),
    ).rejects.toThrow('User not found');
  });
});