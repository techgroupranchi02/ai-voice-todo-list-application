import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let mockTask: Task;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
    mockTask = {
      id: 1,
      userId: 1,
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      categoryId: null,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createTask', () => {
    it('should create and save a task', async () => {
      const createTaskDto: CreateTaskDto = {
        userId: 1,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        categoryId: null,
        completed: false,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockTask);

      const result = await repository.createTask(createTaskDto);
      
      expect(result).toEqual(mockTask);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        userId: createTaskDto.userId,
        title: createTaskDto.title,
        description: createTaskDto.description,
        dueDate: createTaskDto.dueDate,
        priority: createTaskDto.priority,
        categoryId: createTaskDto.categoryId,
        completed: createTaskDto.completed,
      }));
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const result = await repository.updateTask(1, updateTaskDto);
      
      expect(result).toEqual({ ...mockTask, ...updateTaskDto });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw error when task not found during update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(repository.updateTask(1, {} as UpdateTaskDto))
        .rejects.toThrow(`Task with ID 1 not found`);
    });
  });

  describe('findTaskById', () => {
    it('should return a task by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);

      const result = await repository.findTaskById(1);
      
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return undefined when task not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      const result = await repository.findTaskById(999);
      
      expect(result).toBeUndefined();
    });
  });

  describe('findAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [mockTask];
      jest.spyOn(repository, 'find').mockResolvedValue(mockTasks);

      const result = await repository.findAllTasks();
      
      expect(result).toEqual(mockTasks);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findUserTasks', () => {
    it('should return tasks for a specific user', async () => {
      const mockTasks = [mockTask];
      jest.spyOn(repository, 'find').mockResolvedValue(mockTasks);

      const result = await repository.findUserTasks(1);
      
      expect(result).toEqual(mockTasks);
      expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await repository.deleteTask(1);
      
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion status', async () => {
      const completedTask = { ...mockTask, completed: true };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTask);
      jest.spyOn(repository, 'save').mockResolvedValue(completedTask);

      const result = await repository.toggleTaskCompletion(1);
      
      expect(result.completed).toBe(true);
      expect(repository.save).toHaveBeenCalledWith({ ...mockTask, completed: true });
    });

    it('should throw error when task not found during toggle', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(repository.toggleTaskCompletion(1))
        .rejects.toThrow(`Task with ID 1 not found`);
    });
  });
});