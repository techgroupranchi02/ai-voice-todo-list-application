import { execSync } from 'child_process';
import { existsSync } from 'fs';

describe('Docker Configuration Tests', () => {
  test('Dockerfile exists', () => {
    expect(existsSync('./Dockerfile')).toBe(true);
  });

  test('docker-compose.yml exists', () => {
    expect(existsSync('./docker-compose.yml')).toBe(true);
  });

  test('Dockerfile can be built successfully', () => {
    try {
      execSync('docker build -t voice-task-manager-test .', { stdio: 'ignore' });
      expect(true).toBe(true); // If we reach here, build succeeded
    } catch (error) {
      fail('Docker build failed: ' + (error as Error).message);
    }
  });

  test('docker-compose file is valid YAML', () => {
    try {
      execSync('docker-compose config', { stdio: 'ignore' });
      expect(true).toBe(true); // If we reach here, config is valid
    } catch (error) {
      fail('docker-compose config validation failed: ' + (error as Error).message);
    }
  });

  test('Required services are defined in docker-compose', () => {
    const composeContent = require('fs').readFileSync('./docker-compose.yml', 'utf8');
    expect(composeContent).toContain('backend');
    expect(composeContent).toContain('database');
    expect(composeContent).toContain('redis');
    expect(composeContent).toContain('ollama');
  });

  test('Environment variables are properly configured', () => {
    const composeContent = require('fs').readFileSync('./docker-compose.yml', 'utf8');
    
    // Check that required environment variables are present
    expect(composeContent).toContain('DB_HOST=database');
    expect(composeContent).toContain('REDIS_HOST=redis');
    expect(composeContent).toContain('JWT_SECRET=');
    expect(composeContent).toContain('OLLAMA_BASE_URL=http://ollama:11434');
  });

  test('Required ports are exposed', () => {
    const composeContent = require('fs').readFileSync('./docker-compose.yml', 'utf8');
    
    expect(composeContent).toContain('8000:8000'); // Backend port
    expect(composeContent).toContain('5432:5432'); // PostgreSQL port
    expect(composeContent).toContain('6379:6379'); // Redis port
    expect(composeContent).toContain('11434:11434'); // Ollama port
  });

  test('Volume mappings are configured', () => {
    const composeContent = require('fs').readFileSync('./docker-compose.yml', 'utf8');
    
    expect(composeContent).toContain('postgres_data:');
    expect(composeContent).toContain('redis_data:');
    expect(composeContent).toContain('ollama_data:');
  });
});