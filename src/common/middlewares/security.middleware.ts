import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Logger } from 'nestjs-pino';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Security headers
    const helmetMiddleware = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "data:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      xssFilter: true,
      noSniff: true,
      ieNoOpen: true,
    });

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    // Input sanitization middleware
    const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
      if (req.body) {
        // Sanitize input data
        const sanitizeObject = (obj: any): any => {
          if (obj === null || typeof obj !== 'object') return obj;
          
          if (Array.isArray(obj)) {
            return obj.map(item => sanitizeObject(item));
          }
          
          const sanitized: any = {};
          for (const [key, value] of Object.entries(obj)) {
            // Remove potentially dangerous characters
            if (typeof value === 'string') {
              sanitized[key] = value
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/vbscript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
            } else {
              sanitized[key] = sanitizeObject(value);
            }
          }
          return sanitized;
        };

        req.body = sanitizeObject(req.body);
      }
      
      next();
    };

    // Apply helmet security headers
    helmetMiddleware(req, res, (err) => {
      if (err) {
        this.logger.error('Helmet middleware error:', err);
        return next(err);
      }

      // Apply rate limiting
      limiter(req, res, (err) => {
        if (err) {
          this.logger.error('Rate limit error:', err);
          return next(err);
        }

        // Apply input sanitization
        sanitizeInput(req, res, next);
      });
    });
  }
}