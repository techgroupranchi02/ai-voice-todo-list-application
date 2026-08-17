import { validateEnvironment } from './environment-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should validate all required environment variables are present', () => {
    // Set up required environment variables
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    process.env.OLLAMA_API_URL = 'http://localhost:11434';

    expect(() => validateEnvironment()).not.toThrow();
  });

  it('should throw error when required database variables are missing', () => {
    // Missing DB_HOST
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';

    expect(() => validateEnvironment()).toThrow('Missing required environment variable: DB_HOST');
  });

  it('should throw error when JWT secrets are missing', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    // Missing JWT_SECRET and JWT_REFRESH_SECRET

    expect(() => validateEnvironment()).toThrow('Missing required environment variable: JWT_SECRET');
  });

  it('should throw error when OLLAMA_API_URL is missing', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

    expect(() => validateEnvironment()).toThrow('Missing required environment variable: OLLAMA_API_URL');
  });

  it('should handle numeric environment variables correctly', () => {
    process.env.DB_PORT = '5432';
    process.env.REDIS_PORT = '6379';
    process.env.PORT = '8000';
    
    expect(() => validateEnvironment()).not.toThrow();
  });

  it('should throw error for invalid numeric values', () => {
    process.env.DB_PORT = 'invalid_port';
    process.env.DB_HOST = 'localhost';
    process.env.DB_NAME = 'test_db';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_password';
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    process.env.OLLAMA_API_URL = 'http://localhost:11434';

    expect(() => validateEnvironment()).toThrow('Invalid numeric value for DB_PORT');
  });
});