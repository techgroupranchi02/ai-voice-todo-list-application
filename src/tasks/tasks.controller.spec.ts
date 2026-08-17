import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

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

  const mockTasksService = {
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    findOne: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue(mockTask),
    toggleCompletion: jest.fn().mockResolvedValue({ ...mockTask, completed: true }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
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
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 2,
        category: 'Personal',
        completed: false,
      };

      expect(await controller.create(createTaskDto)).toEqual(mockTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      expect(await controller.findAll()).toEqual([mockTask]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a task by ID', async () => {
      expect(await controller.findOne('1')).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      expect(await controller.update('1', updateTaskDto)).toEqual(mockTask);
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion', async () => {
      expect(await controller.toggleCompletion('1')).toEqual({ ...mockTask, completed: true });
      expect(service.toggleCompletion).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});