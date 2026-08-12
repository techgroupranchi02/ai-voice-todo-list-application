import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../../src/tasks/tasks.controller';
import { TasksService } from '../../src/tasks/tasks.service';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { VoiceTaskDto } from '../../src/tasks/dto/voice-task.dto';

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

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread.',
        dueDate: new Date('2024-03-15'),
        priority: 'High',
        category: 'Personal',
      };

      const result = {
        taskId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        message: 'Task created successfully.',
      };

      jest.spyOn(tasksService, 'create').mockResolvedValue(result);

      expect(await controller.createTask(createTaskDto, { user: { userId: '123' } })).toEqual({
        success: true,
        data: result,
      });
    });
  });

  describe('createTaskFromVoice', () => {
    it('should create a task from voice input successfully', async () => {
      const voiceTaskDto: VoiceTaskDto = {
        audioData: 'base64encodedaudio',
      };

      const result = {
        taskId: 'f1g2h3i4-j5k6-l7m8-90ab-cdefghijklmn',
        message: 'Task created from voice input successfully.',
      };

      jest.spyOn(tasksService, 'createFromVoice').mockResolvedValue(result);

      expect(await controller.createTaskFromVoice(voiceTaskDto, { user: { userId: '123' } })).toEqual({
        success: true,
        data: result,
      });
    });
  });
});