// src/cache/cache.service.ts
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class CacheService {
  private client: redis.RedisClientType;

  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    });
    
    this.client.on('error', (err) => console.log('Redis Client Error', err));
    this.client.connect();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async flush(): Promise<void> {
    await this.client.flushAll();
  }
}