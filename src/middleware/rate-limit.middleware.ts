import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const windowMs = this.configService.get<number>('RATE_LIMIT_WINDOW_MS', 900000); // Default 15 minutes
      const maxRequests = this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS', 100); // Default 100 requests
      
      const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
      const key = `rate_limit:${clientIP}`;
      
      const current = await this.redisService.incr(key);
      
      if (current === 1) {
        await this.redisService.expire(key, Math.floor(windowMs / 1000));
      }
      
      if (current > maxRequests) {
        throw new UnauthorizedException('Too many requests, please try again later');
      }
      
      next();
    } catch (error) {
      // If Redis fails, allow the request to proceed
      console.warn('Rate limiting failed:', error);
      next();
    }
  }
}