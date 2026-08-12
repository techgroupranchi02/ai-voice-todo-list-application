import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepository;

  beforeEach(async () => {
    mockTaskRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      const mockSavedTask = {
        id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        ...createTaskDto,
        userId: 'user-id',
      };

      mockTaskRepository.create.mockReturnValue(mockSavedTask);
      mockTaskRepository.save.mockResolvedValue(mockSavedTask);

      const result = await service.create(createTaskDto, 'user-id');

      expect(result).toEqual({ taskId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' });
    });

    it('should throw error for invalid input', async () => {
      const createTaskDto = {
        title: '',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      await expect(service.create(createTaskDto, 'user-id')).rejects.toThrow('Invalid input');
    });
  });

  describe('createFromVoice', () => {
    it('should create a task from voice successfully', async () => {
      const createVoiceTaskDto = {
        audioData: 'base64-encoded-audio-data',
      };

      const mockSavedTask = {
        id: 'f1g2h3i4-j5k6-l7m8-90ab-cdefghijklmn',
        title: 'Voice Task',
        description: 'Task created from voice input: base64-encoded-audio-data...',
        userId: 'user-id',
        priority: 1,
        category: 'Voice Input',
      };

      mockTaskRepository.create.mockReturnValue(mockSavedTask);
      mockTaskRepository.save.mockResolvedValue(mockSavedTask);

      const result = await service.createFromVoice(createVoiceTaskDto, 'user-id');

      expect(result).toEqual({ taskId: 'f1g2h3i4-j5k6-l7m8-90ab-cdefghijklmn' });
    });

    it('should throw error for invalid audio data', async () => {
      const createVoiceTaskDto = {
        audioData: '',
      };

      await expect(service.createFromVoice(createVoiceTaskDto, 'user-id')).rejects.toThrow('Invalid audio data');
    });

    it('should throw error for large audio file', async () => {
      const createVoiceTaskDto = {
        audioData: 'data:audio/wav;base64,' + 'A'.repeat(10 * 1024 * 1024), // 10MB of data
      };

      await expect(service.createFromVoice(createVoiceTaskDto, 'user-id')).rejects.toThrow('Audio file too large');
    });
  });
});