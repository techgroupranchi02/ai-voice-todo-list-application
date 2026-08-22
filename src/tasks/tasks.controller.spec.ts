import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

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

  const mockTasksService = {
    createTask: jest.fn(),
    findOne: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleCompletion: jest.fn(),
    findCompletedTasksByUserId: jest.fn(),
    findPendingTasksByUserId: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      jest.spyOn(service, 'createTask').mockResolvedValue(mockTask as any);

      const result = await controller.create(createTaskDto);
      
      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task created successfully.',
        },
      });
    });

    it('should throw ConflictException when task already exists', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      jest.spyOn(service, 'createTask').mockRejectedValue(new ConflictException('Task already exists'));

      await expect(controller.create(createTaskDto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      jest.spyOn(service, 'createTask').mockRejectedValue(new InternalServerErrorException('Error creating task'));

      await expect(controller.create(createTaskDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask as any);

      const result = await controller.findOne(1);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
    });

    it('should throw NotFoundException when task not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Task not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      
      jest.spyOn(service, 'findAllByUserId').mockResolvedValue(mockTasks as any);

      const result = await controller.findAllByUserId(1);
      
      expect(service.findAllByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask as any);
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockTask, ...updateTaskDto } as any);

      const result = await controller.update(1, updateTaskDto);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task updated successfully.',
        },
      });
    });

    it('should throw NotFoundException when task not found during update', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Task not found'));

      await expect(controller.update(999, updateTaskDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      const result = await controller.remove(1);
      
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task deleted successfully.',
        },
      });
    });

    it('should throw NotFoundException when task not found during deletion', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException('Task not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion status', async () => {
      const updatedTask = { ...mockTask, completed: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockTask as any);
      jest.spyOn(service, 'toggleCompletion').mockResolvedValue(updatedTask as any);

      const result = await controller.toggleCompletion(1);
      
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.toggleCompletion).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: 1,
          message: 'Task completion status updated successfully.',
        },
      });
    });

    it('should throw NotFoundException when task not found during toggle', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Task not found'));

      await expect(controller.toggleCompletion(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCompletedTasksByUserId', () => {
    it('should return completed tasks for a user', async () => {
      const mockTasks = [mockTask];
      
      jest.spyOn(service, 'findCompletedTasksByUserId').mockResolvedValue(mockTasks as any);

      const result = await controller.findCompletedTasksByUserId(1);
      
      expect(service.findCompletedTasksByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
    });
  });

  describe('findPendingTasksByUserId', () => {
    it('should return pending tasks for a user', async () => {
      const mockTasks = [mockTask];
      
      jest.spyOn(service, 'findPendingTasksByUserId').mockResolvedValue(mockTasks as any);

      const result = await controller.findPendingTasksByUserId(1);
      
      expect(service.findPendingTasksByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        data: mockTasks,
      });
    });
  });
});