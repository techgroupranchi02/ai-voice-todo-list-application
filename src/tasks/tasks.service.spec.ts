// src/tasks/tasks.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: any;

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
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn().mockReturnValue(mockTask),
            save: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockResolvedValue(mockTasks),
            findOne: jest.fn().mockImplementation(({ where }) => {
              if (where.id === 1) return Promise.resolve(mockTask);
              return Promise.resolve(null);
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const result = await service.create(mockTask);
      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith(mockTask);
      expect(repository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockTasks);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      await expect(service.findOne(2)).rejects.toThrow(
        new NotFoundException('Task with ID 2 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update and return a task', async () => {
      const updateTaskDto = { title: 'Updated Task' };
      const result = await service.update(1, updateTaskDto);
      expect(result).toEqual({ ...mockTask, ...updateTaskDto });
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });
  });
});