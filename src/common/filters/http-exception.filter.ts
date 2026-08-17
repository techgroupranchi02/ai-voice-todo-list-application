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

    const exceptionResponse = exception.getResponse();
    let message = 'Internal server error';

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse.message;
      } else if ('error' in exceptionResponse) {
        message = exceptionResponse.error;
      }
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    const errorResponse = {
      success: false,
      error: {
        status: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      },
    };

    this.logger.error({
      statusCode: status,
      message: message,
      path: ctx.getRequest().url,
      timestamp: new Date().toISOString(),
      stack: exception.stack,
    });

    response.status(status).json(errorResponse);
  }
}