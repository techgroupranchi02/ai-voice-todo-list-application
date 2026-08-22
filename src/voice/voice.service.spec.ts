import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from './voice.service';
import { TaskRepository } from '../tasks/repositories/task.repository';
import { UserRepository } from '../auth/repositories/user.repository';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('VoiceService', () => {
  let service: VoiceService;
  let taskRepository: TaskRepository;
  let userRepository: UserRepository;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockTask = {
    id: 1,
    userId: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 1,
    category: 'Personal',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceService,
        {
          provide: TaskRepository,
          useValue: {
            createTask: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OLLAMA_API_URL') return 'http://localhost:11434';
              if (key === 'OLLAMA_MODEL_NAME') return 'llama3';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processVoiceInput', () => {
    it('should successfully process voice input and create a task', async () => {
      const audioData = 'base64EncodedAudioData';
      const userId = 1;
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { response: 'Create a task to buy milk' } }));
      jest.spyOn(taskRepository, 'createTask').mockResolvedValue(mockTask);

      const result = await service.processVoiceInput(audioData, userId);

      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task created from voice input successfully.',
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      const audioData = 'base64EncodedAudioData';
      const userId = 999;
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      await expect(service.processVoiceInput(audioData, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when AI processing fails', async () => {
      const audioData = 'base64EncodedAudioData';
      const userId = 1;
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('AI processing error')));

      await expect(service.processVoiceInput(audioData, userId)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException when task creation fails', async () => {
      const audioData = 'base64EncodedAudioData';
      const userId = 1;
      
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { response: 'Create a task to buy milk' } }));
      jest.spyOn(taskRepository, 'createTask').mockRejectedValue(new Error('Database error'));

      await expect(service.processVoiceInput(audioData, userId)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('transcribeAudio', () => {
    it('should successfully transcribe audio using Ollama API', async () => {
      const audioData = 'base64EncodedAudioData';
      
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { response: 'Buy milk from the store' } }));

      const result = await service['transcribeAudio'](audioData);

      expect(result).toBe('Buy milk from the store');
    });

    it('should throw InternalServerErrorException when transcription fails', async () => {
      const audioData = 'base64EncodedAudioData';
      
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Transcription error')));

      await expect(service['transcribeAudio'](audioData)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('extractTaskDetails', () => {
    it('should successfully extract task details from transcript', async () => {
      const transcript = 'Create a task to buy milk and eggs by tomorrow';
      
      jest.spyOn(httpService, 'post').mockReturnValue(of({ data: { response: '{"title": "Buy milk and eggs", "description": "Purchase milk and eggs", "dueDate": "2024-03-15"}' } }));

      const result = await service['extractTaskDetails'](transcript);

      expect(result).toEqual({
        title: 'Buy milk and eggs',
        description: 'Purchase milk and eggs',
        dueDate: new Date('2024-03-15'),
      });
    });

    it('should throw InternalServerErrorException when task extraction fails', async () => {
      const transcript = 'Create a task to buy milk and eggs by tomorrow';
      
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(() => new Error('Extraction error')));

      await expect(service['extractTaskDetails'](transcript)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('calculateBase64Length', () => {
    it('should correctly calculate base64 length without data URI prefix', () => {
      const base64Data = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAAA=';
      
      const result = service['calculateBase64Length'](base64Data);
      
      expect(result).toBe(44); // Length of actual base64 data without prefix
    });

    it('should return correct length for base64 string without prefix', () => {
      const base64Data = 'UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAAA=';
      
      const result = service['calculateBase64Length'](base64Data);
      
      expect(result).toBe(64);
    });
  });
});