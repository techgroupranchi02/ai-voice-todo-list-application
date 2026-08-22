import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception.getStatus();
    const message = exception.message;
    
    this.logger.error({
      statusCode: status,
      message,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });

    response
      .status(status)
      .json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: ctx.getRequest().url,
      });
  }
}