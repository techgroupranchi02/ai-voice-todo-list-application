import { RateLimitMiddleware } from './rate-limit.middleware';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

describe('RateLimitMiddleware', () => {
  let middleware: RateLimitMiddleware;
  let redisService: RedisService;
  let configService: ConfigService;

  const mockRequest = {
    ip: '127.0.0.1',
  } as Request;

  const mockResponse = {} as Response;

  const mockNextFunction = jest.fn() as NextFunction;

  beforeEach(() => {
    redisService = {
      incr: jest.fn(),
      expire: jest.fn(),
    } as unknown as RedisService;

    configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    middleware = new RateLimitMiddleware(redisService, configService);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should allow request when under rate limit', async () => {
    jest.spyOn(redisService, 'incr').mockResolvedValue(1);
    jest.spyOn(configService, 'get').mockReturnValue(900000); // 15 minutes

    await middleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when over rate limit', async () => {
    jest.spyOn(redisService, 'incr').mockResolvedValue(101);
    jest.spyOn(configService, 'get').mockReturnValue(900000); // 15 minutes

    await expect(
      middleware.use(mockRequest, mockResponse, mockNextFunction),
    ).rejects.toThrow('Too many requests, please try again later');
  });

  it('should handle Redis errors gracefully', async () => {
    jest.spyOn(redisService, 'incr').mockRejectedValue(new Error('Redis error'));
    
    await expect(
      middleware.use(mockRequest, mockResponse, mockNextFunction),
    ).resolves.toBeUndefined();
  });
});