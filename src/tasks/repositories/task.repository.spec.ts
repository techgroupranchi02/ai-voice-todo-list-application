import { Test, TestingModule } from '@nestjs/testing';
import { TaskRepository } from './task.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let mockTask: Task;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepository,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<TaskRepository>(TaskRepository);
    mockTask = new Task();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      mockRepository.save.mockResolvedValue(mockTask);

      const result = await repository.createTask(createTaskDto, 1);
      
      expect(result).toBe(mockTask);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await repository.updateTask(1, updateTaskDto);
      
      expect(result).toBe(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(repository.updateTask(1, {} as UpdateTaskDto))
        .rejects.toThrow('Task not found');
    });
  });

  describe('findUserTasks', () => {
    it('should find all user tasks', async () => {
      mockRepository.find.mockResolvedValue([mockTask]);

      const result = await repository.findUserTasks(1);
      
      expect(result).toEqual([mockTask]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findTaskByIdAndUserId', () => {
    it('should find task by id and user id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await repository.findTaskByIdAndUserId(1, 1);
      
      expect(result).toBe(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion', async () => {
      mockTask.completed = false;
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue({ ...mockTask, completed: true });

      const result = await repository.toggleTaskCompletion(1, 1);
      
      expect(result.completed).toBe(true);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(repository.toggleTaskCompletion(1, 1))
        .rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await expect(repository.deleteTask(1, 1)).resolves.not.toThrow();
      expect(mockRepository.delete).toHaveBeenCalled();
    });

    it('should throw error when task not found or unauthorized', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(repository.deleteTask(1, 1))
        .rejects.toThrow('Task not found or unauthorized');
    });
  });
});