import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockLogger: any;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    };

    filter = new HttpExceptionFilter(mockLogger as any);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException properly', () => {
    const exception = new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Bad Request',
      errors: undefined,
      timestamp: expect.any(String),
    });
  });

  it('should handle internal server error', () => {
    const exception = new Error('Internal Server Error');
    
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);
    
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      errors: undefined,
      timestamp: expect.any(String),
    });
  });
});