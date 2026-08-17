// src/teams/teams.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let taskRepository: any;
  let userRepository: any;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    userId: 'user1',
    dueDate: new Date(),
    priority: 1,
    category: 'Personal',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user1',
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
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
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
    it('should create and return a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assigneeId: 'user1',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
      };

      taskRepository.create.mockReturnValue(mockTask);
      taskRepository.save.mockResolvedValue(mockTask);

      const result = await service.createTeamTask('team1', taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTeamTasks', () => {
    it('should return all tasks for a team', async () => {
      taskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.getTeamTasks('team1');
      expect(result).toEqual([mockTask]);
    });
  });

  describe('assignTaskToMember', () => {
    it('should assign a task to a member', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      userRepository.findOne.mockResolvedValue(mockUser);
      taskRepository.save.mockResolvedValue({
        ...mockTask,
        userId: 'user1',
      });

      const result = await service.assignTaskToMember('task1', 'user1');
      expect(result).toEqual({ ...mockTask, userId: 'user1' });
    });

    it('should throw NotFoundException if task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.assignTaskToMember('task1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if assignee not found', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.assignTaskToMember('task1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});