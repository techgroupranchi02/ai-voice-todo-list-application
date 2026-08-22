import { Test, TestingModule } from '@nestjs/testing';
import { VoiceService } from './voice.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { TasksService } from '../tasks/tasks.service';
import { User } from '../auth/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

describe('VoiceService', () => {
  let service: VoiceService;
  let mockConfigService: Partial<ConfigService>;
  let mockHttpService: Partial<HttpService>;
  let mockTasksService: Partial<TasksService>;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask: Task = {
    id: 1,
    userId: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 2,
    category: 'Personal',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'OLLAMA_API_URL':
            return 'http://localhost:11434';
          case 'OLLAMA_MODEL':
            return 'llama3';
          default:
            return null;
        }
      }),
    };

    mockHttpService = {
      post: jest.fn(),
    };

    mockTasksService = {
      createTask: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoiceService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    service = module.get<VoiceService>(VoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processVoiceInput', () => {
    it('should process voice input and create a task successfully', async () => {
      const mockAudioData = 'base64data';
      const mockTranscript = 'Create a meeting with the team at 3pm tomorrow';
      
      (mockHttpService.post as jest.Mock).mockImplementation(() => 
        Promise.resolve({ data: { response: mockTranscript } })
      );
      
      (mockTasksService.createTask as jest.Mock).mockImplementation(() => 
        Promise.resolve(mockTask)
      );

      const result = await service.processVoiceInput(mockAudioData, mockUser);

      expect(result).toBe(mockTask);
      expect(mockHttpService.post).toHaveBeenCalled();
      expect(mockTasksService.createTask).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid audio data', async () => {
      await expect(service.processVoiceInput(null, mockUser)).rejects.toThrow('Invalid audio data provided');
    });
  });

  describe('transcribeAudio', () => {
    it('should transcribe audio successfully', async () => {
      const mockAudioData = 'base64data';
      const mockTranscript = 'This is a test transcription';

      (mockHttpService.post as jest.Mock).mockImplementation(() => 
        Promise.resolve({ data: { response: mockTranscript } })
      );

      const result = await service['transcribeAudio'](mockAudioData);

      expect(result).toBe(mockTranscript);
      expect(mockHttpService.post).toHaveBeenCalled();
    });

    it('should handle data URI prefix correctly', async () => {
      const mockAudioData = 'data:audio/wav;base64,base64data';
      const mockTranscript = 'This is a test transcription';

      (mockHttpService.post as jest.Mock).mockImplementation(() => 
        Promise.resolve({ data: { response: mockTranscript } })
      );

      const result = await service['transcribeAudio'](mockAudioData);

      expect(result).toBe(mockTranscript);
      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });

  describe('extractTaskDetails', () => {
    it('should extract task details from transcript', () => {
      const transcript = 'Buy milk and eggs at the grocery store. Need to complete this by tomorrow.';
      
      const result = service['extractTaskDetails'](transcript);

      expect(result.title).toBe('Buy milk and eggs at the grocery store');
      expect(result.description).toBe('Need to complete this by tomorrow.');
      expect(result.priority).toBe(2);
      expect(result.category).toBe('Personal');
    });

    it('should detect high priority tasks', () => {
      const transcript = 'This is an urgent task that needs to be completed immediately.';
      
      const result = service['extractTaskDetails'](transcript);

      expect(result.priority).toBe(1); // High
    });

    it('should detect low priority tasks', () => {
      const transcript = 'This is a low priority task that can be done later.';
      
      const result = service['extractTaskDetails'](transcript);

      expect(result.priority).toBe(3); // Low
    });

    it('should detect category from transcript', () => {
      const transcript = 'Schedule a work meeting with the team.';
      
      const result = service['extractTaskDetails'](transcript);

      expect(result.category).toBe('Work');
    });
  });
});