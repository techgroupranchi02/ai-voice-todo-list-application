export function validateEnvironment(): void {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'OLLAMA_API_URL'
  ];

  // Check for missing environment variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Validate numeric environment variables
  const numericEnvVars = ['DB_PORT', 'REDIS_PORT', 'PORT'];
  for (const envVar of numericEnvVars) {
    if (process.env[envVar] && isNaN(Number(process.env[envVar]))) {
      throw new Error(`Invalid numeric value for ${envVar}`);
    }
  }

  // Validate JWT secret length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
    throw new Error('JWT_SECRET must be at least 16 characters long');
  }

  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 16) {
    throw new Error('JWT_REFRESH_SECRET must be at least 16 characters long');
  }

  // Validate OLLAMA_API_URL format
  if (process.env.OLLAMA_API_URL) {
    try {
      const url = new URL(process.env.OLLAMA_API_URL);
      if (!url.protocol || !url.hostname) {
        throw new Error('Invalid OLLAMA_API_URL format');
      }
    } catch (error) {
      throw new Error('Invalid OLLAMA_API_URL format');
    }
  }

  // Validate database connection string if provided
  if (process.env.DB_CONNECTION_STRING) {
    try {
      const url = new URL(process.env.DB_CONNECTION_STRING);
      if (!url.protocol || !url.hostname) {
        throw new Error('Invalid DB_CONNECTION_STRING format');
      }
    } catch (error) {
      throw new Error('Invalid DB_CONNECTION_STRING format');
    }
  }

  console.log('Environment validation passed successfully');
}