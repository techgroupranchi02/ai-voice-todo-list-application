import { Injectable, NestMiddleware, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';

export interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    timestamp: string;
    path?: string;
  };
}

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Global error handling middleware
    const originalSend = res.send;

    res.send = function (body) {
      // If body is already an error response, don't modify it
      if (typeof body === 'object' && body !== null && body.error) {
        return originalSend.call(this, body);
      }

      // Check if this is a JSON response that should be wrapped
      if (res.get('Content-Type')?.includes('application/json')) {
        try {
          const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
          
          // If it's an error response, wrap it properly
          if (parsedBody && parsedBody.statusCode && parsedBody.message) {
            const errorResponse: ErrorResponse = {
              success: false,
              error: {
                message: parsedBody.message,
                code: parsedBody.error?.code || parsedBody.name,
                statusCode: parsedBody.statusCode,
                timestamp: new Date().toISOString(),
                path: req.path
              }
            };
            
            return originalSend.call(this, JSON.stringify(errorResponse));
          }
        } catch (e) {
          // If parsing fails, continue with original body
        }
      }

      return originalSend.call(this, body);
    };

    next();
  }
}

// Global exception filter for unhandled errors
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default error status code
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle different types of exceptions
    if (exception.status) {
      // HttpException
      statusCode = exception.status;
      message = exception.message || exception.response?.message || 'HTTP Exception occurred';
    } else if (exception.name === 'ValidationError') {
      // Class-validator validation error
      statusCode = 400;
      message = 'Validation failed';
    } else if (exception.name === 'EntityNotFound') {
      // TypeORM entity not found
      statusCode = 404;
      message = 'Resource not found';
    } else if (exception.name === 'TokenExpiredError') {
      // JWT token expired
      statusCode = 401;
      message = 'Token expired';
    } else if (exception.name === 'JsonWebTokenError') {
      // Invalid JWT token
      statusCode = 401;
      message = 'Invalid token';
    } else {
      // Log unexpected errors
      this.logger.error({
        message: 'Unhandled error occurred',
        error: exception,
        stack: exception.stack,
        timestamp: new Date().toISOString(),
        path: request.path,
        method: request.method,
        userAgent: request.get('User-Agent'),
        ip: request.ip
      });
    }

    // Create standardized error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message,
        code: exception.name,
        statusCode,
        timestamp: new Date().toISOString(),
        path: request.path
      }
    };

    // Log the error
    this.logger.error({
      message: errorResponse.error.message,
      code: errorResponse.error.code,
      statusCode: errorResponse.error.statusCode,
      timestamp: errorResponse.error.timestamp,
      path: errorResponse.error.path,
      stack: exception.stack
    });

    return response.status(statusCode).json(errorResponse);
  }
}