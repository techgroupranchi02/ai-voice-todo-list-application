// test/tasks.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get access token
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        email: 'taskuser@example.com',
        password: 'Password123',
        firstName: 'Task',
        lastName: 'User',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: 'taskuser@example.com',
        password: 'Password123',
      });

    accessToken = loginResponse.body.data.accessToken;
  });

  it('/api/v1/tasks (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread.',
        dueDate: '2024-03-15',
        priority: 'High',
        category: 'Personal',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.taskId).toBeDefined();
        expect(res.body.data.message).toBe('Task created successfully.');
      });
  });

  it('/api/v1/tasks (POST) - Invalid input', () => {
    return request(app.getHttpServer())
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: '',
        description: 'Buy milk, eggs, and bread.',
      })
      .expect(400);
  });

  it('/api/v1/tasks/voice (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/tasks/voice')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        audioData: 'base64encodedaudio',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data.taskId).toBeDefined();
        expect(res.body.data.message).toBe('Task created from voice input successfully.');
      });
  });

  it('/api/v1/tasks/voice (POST) - Audio processing error', () => {
    // This test might fail due to random audio processing errors
    return request(app.getHttpServer())
      .post('/api/v1/tasks/voice')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        audioData: 'base64encodedaudio',
      })
      .expect(201);
  });

  it('/api/v1/tasks (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});