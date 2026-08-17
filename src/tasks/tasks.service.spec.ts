import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };
      
      const mockTask = { id: 1, ...createTaskDto, user: { id: 1 } };
      
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto, 1);
      
      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: { id: 1 },
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', user: { id: 1 } },
        { id: 2, title: 'Task 2', user: { id: 1 } },
      ];
      
      mockTaskRepository.find.mockResolvedValue(mockTasks);

      const result = await service.findAll(1);
      
      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockTask = { id: 1, title: 'Test Task', user: { id: 1 } };
      
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1, 1);
      
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      expect(service.findOne(1, 1)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update and return a task', async () => {
      const mockTask = { id: 1, title: 'Test Task', user: { id: 1 } };
      
      mockTaskRepository.findOne.mockResolvedValue(mockTask);
      mockTaskRepository.save.mockResolvedValue({ ...mockTask, title: 'Updated Task' });

      const result = await service.update(1, { title: 'Updated Task' }, 1);
      
      expect(result.title).toEqual('Updated Task');
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove(1, 1)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when task not found', async () => {
      mockTaskRepository.delete.mockResolvedValue({ affected: 0 } as any);

      expect(service.remove(1, 1)).rejects.toThrow();
    });
  });
});