import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TaskRepository;

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

  const mockTaskRepository = {
    createTask: jest.fn(),
    findTaskById: jest.fn(),
    findTasksByUserId: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    toggleTaskCompletion: jest.fn(),
    findCompletedTasksByUserId: jest.fn(),
    findPendingTasksByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TaskRepository>(TaskRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      jest.spyOn(repository, 'createTask').mockResolvedValue(mockTask as any);

      const result = await service.createTask(createTaskDto);
      
      expect(repository.createTask).toHaveBeenCalledWith(createTaskDto);
      expect(result).toBe(mockTask);
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

      jest.spyOn(repository, 'createTask').mockRejectedValue(new ConflictException('Task already exists'));

      await expect(service.createTask(createTaskDto)).rejects.toThrow(ConflictException);
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

      jest.spyOn(repository, 'createTask').mockRejectedValue(new InternalServerErrorException('Error creating task'));

      await expect(service.createTask(createTaskDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      jest.spyOn(repository, 'findTaskById').mockResolvedValue(mockTask as any);

      const result = await service.findOne(1);
      
      expect(repository.findTaskById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      jest.spyOn(repository, 'findTaskById').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [mockTask, { ...mockTask, id: 2 }];
      
      jest.spyOn(repository, 'findTasksByUserId').mockResolvedValue(mockTasks as any);

      const result = await service.findAllByUserId(1);
      
      expect(repository.findTasksByUserId).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTasks);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      jest.spyOn(repository, 'findTaskById').mockResolvedValue(mockTask as any);
      jest.spyOn(repository, 'updateTask').mockResolvedValue({ ...mockTask, ...updateTaskDto } as any);

      const result = await service.update(1, updateTaskDto);
      
      expect(repository.findTaskById).toHaveBeenCalledWith(1);
      expect(repository.updateTask).toHaveBeenCalledWith(1, updateTaskDto);
      expect(result.title).toBe('Updated Task');
    });

    it('should throw NotFoundException when task not found during update', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      jest.spyOn(repository, 'findTaskById').mockResolvedValue(null);

      await expect(service.update(999, updateTaskDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when task with same title exists', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      jest.spyOn(repository, 'findTaskById').mockResolvedValue(mockTask as any);
      jest.spyOn(repository, 'updateTask').mockRejectedValue(new ConflictException('Task with this title already exists'));

      await expect(service.update(1, updateTaskDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      jest.spyOn(repository, 'deleteTask').mockResolvedValue();

      await service.remove(1);
      
      expect(repository.deleteTask).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task not found during deletion', async () => {
      jest.spyOn(repository, 'deleteTask').mockRejectedValue(new NotFoundException('Task not found'));

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion status', async () => {
      const updatedTask = { ...mockTask, completed: true };
      
      jest.spyOn(repository, 'findTaskById').mockResolvedValue(mockTask as any);
      jest.spyOn(repository, 'toggleTaskCompletion').mockResolvedValue(updatedTask as any);

      const result = await service.toggleCompletion(1);
      
      expect(repository.findTaskById).toHaveBeenCalledWith(1);
      expect(repository.toggleTaskCompletion).toHaveBeenCalledWith(1);
      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException when task not found during toggle', async () => {
      jest.spyOn(repository, 'findTaskById').mockResolvedValue(null);

      await expect(service.toggleCompletion(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCompletedTasksByUserId', () => {
    it('should return completed tasks for a user', async () => {
      const mockTasks = [mockTask];
      
      jest.spyOn(repository, 'findCompletedTasksByUserId').mockResolvedValue(mockTasks as any);

      const result = await service.findCompletedTasksByUserId(1);
      
      expect(repository.findCompletedTasksByUserId).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTasks);
    });
  });

  describe('findPendingTasksByUserId', () => {
    it('should return pending tasks for a user', async () => {
      const mockTasks = [mockTask];
      
      jest.spyOn(repository, 'findPendingTasksByUserId').mockResolvedValue(mockTasks as any);

      const result = await service.findPendingTasksByUserId(1);
      
      expect(repository.findPendingTasksByUserId).toHaveBeenCalledWith(1);
      expect(result).toBe(mockTasks);
    });
  });
});