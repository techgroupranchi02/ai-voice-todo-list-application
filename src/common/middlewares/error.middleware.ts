import { Injectable, NestMiddleware, ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as pino from 'pino';

@Injectable()
export class ErrorMiddleware implements NestMiddleware {
  private logger = pino.default({ level: 'info' });

  use(req: Request, res: Response, next: NextFunction) {
    const originalSend = res.send;

    res.send = function (body?: any) {
      // Log the response
      if (body && typeof body === 'object') {
        const { success, data, error } = body;
        
        if (!success && error) {
          this.logger.error({
            message: error.message || 'An error occurred',
            statusCode: error.statusCode || res.statusCode,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString(),
            stack: error.stack
          });
        } else if (success && data) {
          this.logger.info({
            message: 'Request successful',
            statusCode: res.statusCode,
            path: req.path,
            method: req.method,
            timestamp: new Date().toISOString()
          });
        }
      }

      return originalSend.call(this, body);
    };

    next();
  }
}

// Global exception filter for standardized error responses
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger = pino.default({ level: 'error' });

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Handle different types of exceptions
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = exception.message;

    if (exception.status) {
      status = exception.status;
    }

    if (exception.response && typeof exception.response === 'object') {
      if (exception.response.message) {
        message = Array.isArray(exception.response.message)
          ? exception.response.message.join(', ')
          : exception.response.message;
      }
      if (exception.response.error) {
        error = exception.response.error;
      }
    } else if (exception.message) {
      message = exception.message;
    }

    // Log the error
    this.logger.error({
      message: error,
      statusCode: status,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      stack: exception.stack,
      userAgent: request.get('User-Agent'),
      ip: request.ip
    });

    // Send standardized error response
    response.status(status).json({
      success: false,
      error: {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method
      }
    });
  }
}