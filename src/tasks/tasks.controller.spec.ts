// src/tasks/tasks.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 1,
    category: 'Personal',
    completed: false,
  };

  const mockTasks = [mockTask];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTask),
            findAll: jest.fn().mockResolvedValue(mockTasks),
            findOne: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue(mockTask),
            remove: jest.fn().mockResolvedValue(undefined),
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
    it('should create a task and return success response', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      const result = await controller.create(createTaskDto);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Task created successfully.',
        },
      });
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks with success response', async () => {
      const result = await controller.findAll();
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task with success response', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task and return success response', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      const result = await controller.update(1, updateTaskDto);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove a task and return success response', async () => {
      const result = await controller.remove(1);
      expect(result).toEqual({
        success: true,
        data: {
          message: 'Task deleted successfully.',
        },
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});