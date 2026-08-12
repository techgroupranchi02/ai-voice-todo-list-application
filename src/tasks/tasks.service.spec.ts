import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get(getRepositoryToken(Task));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      const createTaskDto = { title: 'Test Task' };
      const mockTask = { id: '1', ...createTaskDto, user: mockUser };
      
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);
      
      const result = await service.create(createTaskDto, mockUser);
      
      expect(result).toEqual({
        taskId: '1',
        message: 'Task created successfully.',
      });
    });

    it('should throw error when title is empty', async () => {
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      const createTaskDto = { title: '' };
      
      await expect(service.create(createTaskDto, mockUser)).rejects.toThrow('Title cannot be empty.');
    });
  });

  describe('createFromVoice', () => {
    it('should process voice input successfully', async () => {
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      const audioData = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAf';
      
      const mockTask = { 
        id: '1', 
        title: 'Voice Task',
        description: 'Task created from voice input',
        user: mockUser,
        priority: 1,
        completed: false
      };
      
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);
      
      const result = await service.createFromVoice(audioData, mockUser);
      
      expect(result).toEqual({
        taskId: '1',
        message: 'Task created from voice input successfully.',
      });
    });

    it('should throw error when audio data is missing', async () => {
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      
      await expect(service.createFromVoice('', mockUser)).rejects.toThrow('Audio data is required.');
    });

    it('should throw error when audio format is invalid', async () => {
      const mockUser: User = { id: '1', email: 'test@example.com' } as User;
      const audioData = 'invalid-audio-data';
      
      await expect(service.createFromVoice(audioData, mockUser)).rejects.toThrow('Invalid audio data format. Expected base64 encoded audio.');
    });
  });
});