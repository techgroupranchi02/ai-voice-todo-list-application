import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    
    return next
      .handle()
      .pipe(
        tap(() => {
          const request = context.switchToHttp().getRequest();
          const response = context.switchToHttp().getResponse();
          
          this.logger.info({
            method: request.method,
            url: request.url,
            statusCode: response.statusCode,
            responseTime: `${Date.now() - now}ms`,
            timestamp: new Date().toISOString(),
          });
        }),
      );
  }
}