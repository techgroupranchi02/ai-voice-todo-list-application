import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let taskRepository: any;
  let userRepository: any;

  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: 1,
    completed: false,
    user: { id: 1 } as User,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn().mockResolvedValue(mockTask),
            find: jest.fn().mockResolvedValue([mockTask]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    taskRepository = module.get(getRepositoryToken(Task));
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeamTask', () => {
    const createTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
      assigneeId: 2,
    };

    it('should create a team task successfully', async () => {
      const result = await service.createTeamTask(1, createTaskDto, 1);
      
      expect(result).toEqual(mockTask);
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when assignee is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      
      await expect(
        service.createTeamTask(1, createTaskDto, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTeamTasks', () => {
    it('should return team tasks successfully', async () => {
      const result = await service.getTeamTasks(1, 1);
      
      expect(result).toEqual([mockTask]);
      expect(taskRepository.find).toHaveBeenCalled();
    });
  });
});