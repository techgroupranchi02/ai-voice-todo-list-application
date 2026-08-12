// src/tasks/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            createFromVoice: jest.fn(),
            createTeamTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const result = { success: true, data: { taskId: '1', message: 'Task created successfully.' } };
      jest.spyOn(service, 'create').mockResolvedValue(result);
      
      expect(await controller.create({ title: 'Test Task' }, { user: { id: 1 } })).toBe(result);
    });
  });

  describe('createFromVoice', () => {
    it('should create a task from voice input', async () => {
      const result = { success: true, data: { taskId: '1', message: 'Task created from voice input successfully.' } };
      jest.spyOn(service, 'createFromVoice').mockResolvedValue(result);
      
      expect(await controller.createFromVoice({ audioData: 'base64data' }, { user: { id: 1 } })).toBe(result);
    });
  });

  describe('createTeamTask', () => {
    it('should create a team task', async () => {
      const result = { success: true, data: { taskId: '1', message: 'Team task created successfully.' } };
      jest.spyOn(service, 'createTeamTask').mockResolvedValue(result);
      
      expect(await controller.createTeamTask('team1', { title: 'Team Task' }, { user: { id: 1 } })).toBe(result);
    });
  });
});