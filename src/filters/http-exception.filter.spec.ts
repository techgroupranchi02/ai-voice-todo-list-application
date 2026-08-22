import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from 'nestjs-pino';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockLogger: Logger;
  let mockResponse: Partial<Response>;
  let mockContext: Partial<ArgumentsHost>;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    } as unknown as Logger;

    filter = new HttpExceptionFilter(mockLogger);
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue({
          url: '/test',
        }),
      }),
    };
  });

  it('should catch HttpException and return proper response', () => {
    const exception = new HttpException('Test error', 400);
    
    filter.catch(exception, mockContext as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Test error',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should log the error with proper context', () => {
    const exception = new HttpException('Test error', 400);
    
    filter.catch(exception, mockContext as ArgumentsHost);

    expect(mockLogger.error).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Test error',
      stack: exception.stack,
      timestamp: expect.any(String),
      path: '/test',
    });
  });
});