import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    update: jest.fn(),
  };

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'Test Description',
  };

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: 'Updated Task',
    description: 'Updated Description',
    completed: true,
  };

  beforeEach(async () => {
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
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedResult = [mockTask];
      mockTaskRepository.find.mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(result).toEqual(expectedResult);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no tasks exist', async () => {
      mockTaskRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(mockTask);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when task is not found', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const expectedResult = { ...mockTask, id: 1 };
      mockTaskRepository.create.mockReturnValue(expectedResult);
      mockTaskRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(mockCreateTaskDto);
      expect(result).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledWith(mockCreateTaskDto);
      expect(repository.save).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('update', () => {
    it('should update and return the updated task', async () => {
      const expectedResult = { ...mockTask, ...mockUpdateTaskDto };
      mockTaskRepository.findOneBy.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(expectedResult);

      const result = await service.update(1, mockUpdateTaskDto);
      expect(result).toEqual(expectedResult);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(expectedResult);
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, mockUpdateTaskDto)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(mockTask);
      mockTaskRepository.remove.mockResolvedValue(mockTask);

      const result = await service.remove(1);
      expect(result).toEqual(mockTask);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException when removing non-existent task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('toggleComplete', () => {
    it('should toggle task completion status', async () => {
      const taskToToggle = { ...mockTask, completed: false };
      const toggledTask = { ...taskToToggle, completed: true };
      
      mockTaskRepository.findOneBy.mockResolvedValue(taskToToggle);
      mockTaskRepository.save.mockResolvedValue(toggledTask);

      const result = await service.toggleComplete(1);
      expect(result).toEqual(toggledTask);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith({
        ...taskToToggle,
        completed: true,
      });
    });

    it('should toggle task completion status from true to false', async () => {
      const taskToToggle = { ...mockTask, completed: true };
      const toggledTask = { ...taskToToggle, completed: false };
      
      mockTaskRepository.findOneBy.mockResolvedValue(taskToToggle);
      mockTaskRepository.save.mockResolvedValue(toggledTask);

      const result = await service.toggleComplete(1);
      expect(result).toEqual(toggledTask);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith({
        ...taskToToggle,
        completed: false,
      });
    });

    it('should throw NotFoundException when toggling non-existent task', async () => {
      mockTaskRepository.findOneBy.mockResolvedValue(null);

      await expect(service.toggleComplete(999)).rejects.toThrow(
        new NotFoundException('Task with ID 999 not found'),
      );
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});