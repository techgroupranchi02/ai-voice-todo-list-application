import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Log the error
    this.logger.error({
      statusCode: status,
      message: exception.message,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });

    // Format error response
    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message: this.getErrorMessage(exception),
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      },
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: HttpException): string {
    const message = exception.message;
    
    // Handle specific error cases
    if (message === 'Email already exists') {
      return 'Registration failed';
    }
    
    if (message === 'Invalid credentials') {
      return 'Invalid credentials';
    }
    
    // Return the original message for other cases
    return message;
  }
}