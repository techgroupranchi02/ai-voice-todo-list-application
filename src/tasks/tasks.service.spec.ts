import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 2,
    category: 'Personal',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockTask),
    save: jest.fn().mockResolvedValue(mockTask),
    findOne: jest.fn().mockResolvedValue(mockTask),
    find: jest.fn().mockResolvedValue([mockTask]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
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
        priority: 2,
        category: 'Personal',
        completed: false,
      };

      expect(await service.create(createTaskDto)).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      expect(await service.update(1, updateTaskDto)).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a task by ID successfully', async () => {
      expect(await service.findOne(1)).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      expect(await service.findAll()).toEqual([mockTask]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion successfully', async () => {
      const updatedTask = { ...mockTask, completed: true };
      repository.findOne = jest.fn().mockResolvedValue(mockTask);
      repository.save = jest.fn().mockResolvedValue(updatedTask);

      expect(await service.toggleCompletion(1)).toEqual(updatedTask);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task successfully', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});