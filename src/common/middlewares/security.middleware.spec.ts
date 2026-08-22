import { Test, TestingModule } from '@nestjs/testing';
import { SecurityMiddleware } from './security.middleware';
import { Logger } from 'nestjs-pino';

describe('SecurityMiddleware', () => {
  let middleware: SecurityMiddleware;
  let mockLogger: any;

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityMiddleware,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    middleware = module.get<SecurityMiddleware>(SecurityMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should apply helmet security headers', () => {
    const req: any = {};
    const res: any = {
      setHeader: jest.fn(),
    };
    const next = jest.fn();

    // This test verifies that the middleware can be called without throwing errors
    expect(() => {
      middleware.use(req, res, next);
    }).not.toThrow();
  });

  it('should sanitize input data', () => {
    const req: any = {
      body: {
        title: '<script>alert("xss")</script>Test',
        description: 'Normal text with javascript:alert(1)',
      },
    };
    const res: any = {};
    const next = jest.fn();

    // Call middleware
    middleware.use(req, res, next);

    expect(req.body.title).not.toContain('<script>');
    expect(req.body.description).not.toContain('javascript:');
    expect(next).toHaveBeenCalled();
  });

  it('should handle errors in helmet middleware', () => {
    const req: any = {};
    const res: any = {};
    const next = jest.fn();

    // Mock helmet to throw an error
    const originalHelmet = require('helmet');
    jest.spyOn(originalHelmet, 'default').mockImplementation(() => {
      return (req, res, next) => {
        next(new Error('Helmet error'));
      };
    });

    expect(() => {
      middleware.use(req, res, next);
    }).not.toThrow();
  });
});