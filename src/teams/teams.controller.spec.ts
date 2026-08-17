// src/teams/teams.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { NotFoundException } from '@nestjs/common';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            createTeamTask: jest.fn(),
            getTeamTasks: jest.fn(),
            assignTaskToMember: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTeamTask', () => {
    it('should create a team task and return success response', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        assigneeId: 'user1',
      };

      service.createTeamTask.mockResolvedValue(mockTask);

      const result = await controller.createTeamTask('team1', createTaskDto);
      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Team task created successfully.',
        },
      });
    });

    it('should throw NotFoundException if team does not exist', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(),
        priority: 1,
        category: 'Personal',
        assigneeId: 'user1',
      };

      service.createTeamTask.mockRejectedValue(
        new NotFoundException('The specified team does not exist.'),
      );

      await expect(
        controller.createTeamTask('team1', createTaskDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTeamTasks', () => {
    it('should return tasks for a team', async () => {
      service.getTeamTasks.mockResolvedValue([mockTask]);

      const result = await controller.getTeamTasks('team1');
      expect(result).toEqual({
        success: true,
        data: [mockTask],
      });
    });

    it('should throw NotFoundException if team does not exist', async () => {
      service.getTeamTasks.mockRejectedValue(
        new NotFoundException('The specified team does not exist.'),
      );

      await expect(controller.getTeamTasks('team1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignTaskToMember', () => {
    it('should assign a task to a member and return success response', async () => {
      service.assignTaskToMember.mockResolvedValue(mockTask);

      const result = await controller.assignTaskToMember('team1', 'task1', 'user1');
      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Task assigned successfully.',
        },
      });
    });

    it('should throw NotFoundException if task or assignee not found', async () => {
      service.assignTaskToMember.mockRejectedValue(
        new NotFoundException('Task or assignee not found.'),
      );

      await expect(
        controller.assignTaskToMember('team1', 'task1', 'user1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});