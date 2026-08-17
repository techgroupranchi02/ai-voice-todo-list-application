import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: TaskRepository;

  const mockTaskRepository = {
    createTask: jest.fn(),
    findAllTasks: jest.fn(),
    findTaskById: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    toggleTaskCompletion: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
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

      mockTaskRepository.createTask.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);
      expect(result).toEqual(mockTask);
      expect(repository.createTask).toHaveBeenCalledWith(createTaskDto);
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

      mockTaskRepository.createTask.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createTaskDto)).rejects.toThrow(Error);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
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

      mockTaskRepository.findAllTasks.mockResolvedValue(mockTasks);

      const result = await service.findAll();
      expect(result).toEqual(mockTasks);
      expect(repository.findAllTasks).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
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

      mockTaskRepository.findTaskById.mockResolvedValue(mockTask);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(repository.findTaskById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTaskRepository.findTaskById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
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

      mockTaskRepository.updateTask.mockResolvedValue(mockTask);

      const result = await service.update(1, updateTaskDto);
      expect(result).toEqual(mockTask);
      expect(repository.updateTask).toHaveBeenCalledWith(1, updateTaskDto);
    });

    it('should throw an error when task update fails', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockTaskRepository.updateTask.mockRejectedValue(new Error('Database error'));

      await expect(service.update(1, updateTaskDto)).rejects.toThrow(Error);
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      mockTaskRepository.deleteTask.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.deleteTask).toHaveBeenCalledWith(1);
    });

    it('should throw an error when task deletion fails', async () => {
      mockTaskRepository.deleteTask.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(1)).rejects.toThrow(Error);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion successfully', async () => {
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

      mockTaskRepository.toggleTaskCompletion.mockResolvedValue(mockTask);

      const result = await service.toggleCompletion(1);
      expect(result).toEqual(mockTask);
      expect(repository.toggleTaskCompletion).toHaveBeenCalledWith(1);
    });

    it('should throw an error when toggling completion fails', async () => {
      mockTaskRepository.toggleTaskCompletion.mockRejectedValue(new Error('Database error'));

      await expect(service.toggleCompletion(1)).rejects.toThrow(Error);
    });
  });
});