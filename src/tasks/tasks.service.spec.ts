import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let mockTaskRepository: any;

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
    mockTaskRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 0,
        category: 'Personal',
      };

      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, 1);
      
      expect(result).toBe(mockTask);
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      mockTaskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findAll(1);
      
      expect(result).toEqual([mockTask]);
      expect(mockTaskRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1, 1);
      
      expect(result).toBe(mockTask);
      expect(mockTaskRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue({ ...mockTask, ...updateTaskDto });

      const result = await service.update(1, updateTaskDto, 1);
      
      expect(result.title).toBe('Updated Task');
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1, 1)).resolves.toBeUndefined();
      expect(mockTaskRepository.delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException when trying to delete non-existent task', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});