import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue(mockJwtAuthGuard)
    .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and return success response', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };
      
      const mockTask = { id: 1, ...createTaskDto, user: { id: 1 } };
      
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto, { user: { id: 1 } });
      
      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task created successfully.',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks and return success response', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', user: { id: 1 } },
        { id: 2, title: 'Task 2', user: { id: 1 } },
      ];
      
      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll({ user: { id: 1 } });
      
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
    });
  });

  describe('findOne', () => {
    it('should return a task and return success response', async () => {
      const mockTask = { id: 1, title: 'Test Task', user: { id: 1 } };
      
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(1, { user: { id: 1 } });
      
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
    });
  });

  describe('update', () => {
    it('should update a task and return success response', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const mockTask = { id: 1, ...updateTaskDto, user: { id: 1 } };
      
      mockTasksService.update.mockResolvedValue(mockTask);

      const result = await controller.update(1, updateTaskDto, { user: { id: 1 } });
      
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
    });
  });

  describe('remove', () => {
    it('should remove a task and return success response', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1, { user: { id: 1 } });
      
      expect(result).toEqual({
        success: true,
        data: {
          message: 'Task deleted successfully.',
        },
      });
    });
  });
});