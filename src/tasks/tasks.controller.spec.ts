import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let mockTasksService: any;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 0,
    category: 'Personal',
    completed: false,
    user: { id: 1 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockTasksService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

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
        priority: 0,
        category: 'Personal',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const req = { user: { id: 1 } };
      
      const result = await controller.create(createTaskDto, req);
      
      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Task created successfully.',
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks and return success response', async () => {
      mockTasksService.findAll.mockResolvedValue([mockTask]);

      const req = { user: { id: 1 } };
      
      const result = await controller.findAll(req);
      
      expect(result).toEqual({
        success: true,
        data: [mockTask],
      });
    });
  });

  describe('findOne', () => {
    it('should return a task and return success response', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const req = { user: { id: 1 } };
      
      const result = await controller.findOne(1, req);
      
      expect(result).toEqual({
        success: true,
        data: mockTask,
      });
    });
  });

  describe('update', () => {
    it('should update a task and return success response', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      
      mockTasksService.update.mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const req = { user: { id: 1 } };
      
      const result = await controller.update(1, updateTaskDto, req);
      
      expect(result).toEqual({
        success: true,
        data: { ...mockTask, ...updateTaskDto },
      });
    });
  });

  describe('remove', () => {
    it('should remove a task and return success response', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const req = { user: { id: 1 } };
      
      const result = await controller.remove(1, req);
      
      expect(result).toEqual({
        success: true,
        data: {
          message: 'Task deleted successfully.',
        },
      });
    });
  });
});