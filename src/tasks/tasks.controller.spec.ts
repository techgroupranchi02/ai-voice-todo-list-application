import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            createFromVoice: jest.fn(),
            createInTeam: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      const result = { taskId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' };
      
      jest.spyOn(tasksService, 'create').mockResolvedValue(result);

      expect(await controller.create(createTaskDto, { user: { userId: 'user-id' } })).toEqual({
        success: true,
        data: result,
      });
    });

    it('should handle invalid input error', async () => {
      const createTaskDto: CreateTaskDto = {
        title: '',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 1,
        category: 'Personal',
      };

      jest.spyOn(tasksService, 'create').mockRejectedValue(new Error('Invalid input'));

      expect(await controller.create(createTaskDto, { user: { userId: 'user-id' } })).toEqual({
        success: false,
        error: {
          code: 400,
          message: 'Title cannot be empty.',
        },
      });
    });
  });

  describe('createFromVoice', () => {
    it('should create a task from voice successfully', async () => {
      const createVoiceTaskDto: CreateVoiceTaskDto = {
        audioData: 'base64-encoded-audio-data',
      };

      const result = { taskId: 'f1g2h3i4-j5k6-l7m8-90ab-cdefghijklmn' };
      
      jest.spyOn(tasksService, 'createFromVoice').mockResolvedValue(result);

      expect(await controller.createFromVoice(createVoiceTaskDto, { user: { userId: 'user-id' } })).toEqual({
        success: true,
        data: result,
      });
    });

    it('should handle audio processing error', async () => {
      const createVoiceTaskDto: CreateVoiceTaskDto = {
        audioData: 'base64-encoded-audio-data',
      };

      jest.spyOn(tasksService, 'createFromVoice').mockRejectedValue(new Error('Audio processing error'));

      expect(await controller.createFromVoice(createVoiceTaskDto, { user: { userId: 'user-id' } })).toEqual({
        success: false,
        error: {
          code: 500,
          message: 'Error processing the audio data.',
        },
      });
    });
  });
});