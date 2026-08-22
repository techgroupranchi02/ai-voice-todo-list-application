import { LoggingInterceptor } from './logging.interceptor';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let mockLogger: Logger;
  let mockContext: Partial<ExecutionContext>;
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: any;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
    } as unknown as Logger;

    interceptor = new LoggingInterceptor(mockLogger);
    
    mockRequest = {
      method: 'GET',
      url: '/test',
    };

    mockResponse = {
      statusCode: 200,
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    };

    mockNext = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      }),
    };
  });

  it('should log request and response information', () => {
    const result = interceptor.intercept(mockContext as ExecutionContext, mockNext);

    expect(mockLogger.info).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      statusCode: 200,
      responseTime: expect.stringContaining('ms'),
      timestamp: expect.any(String),
    });
  });
});