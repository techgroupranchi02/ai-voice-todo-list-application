import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleCompletion: jest.fn(),
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
        completed: false,
        user: { id: 1 },
      };

      const mockTask: Task = {
        id: 1,
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should throw an error when task creation fails', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        completed: false,
        user: { id: 1 },
      };

      mockTasksService.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createTaskDto)).rejects.toThrow(Error);
    });
  });

  describe('findAll', () => {
    it('should return all tasks and success response', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'Test Description 1',
          dueDate: new Date(),
          priority: 1,
          category: 'Personal',
          completed: false,
          user: { id: 1 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Test Description 2',
          dueDate: new Date(),
          priority: 2,
          category: 'Work',
          completed: true,
          user: { id: 1 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll();
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task and success response', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        completed: false,
        user: { id: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(1);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task and return success response', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      const mockTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        completed: false,
        user: { id: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(mockTask);

      const result = await controller.update(1, updateTaskDto);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    });

    it('should throw an error when task update fails', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockTasksService.update.mockRejectedValue(new Error('Database error'));

      await expect(controller.update(1, updateTaskDto)).rejects.toThrow(Error);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion and return success response', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        completed: true,
        user: { id: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.toggleCompletion.mockResolvedValue(mockTask);

      const result = await controller.toggleCompletion(1);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
      expect(service.toggleCompletion).toHaveBeenCalledWith(1);
    });

    it('should throw an error when toggling completion fails', async () => {
      mockTasksService.toggleCompletion.mockRejectedValue(new Error('Database error'));

      await expect(controller.toggleCompletion(1)).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should delete a task and return success response', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);
      expect(result).toEqual({
        success: true,
        message: 'Task deleted successfully',
      });
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an error when task deletion fails', async () => {
      mockTasksService.remove.mockRejectedValue(new Error('Database error'));

      await expect(controller.remove(1)).rejects.toThrow(Error);
    });
  });
});