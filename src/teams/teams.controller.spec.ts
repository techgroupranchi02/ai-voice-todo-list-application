import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { User } from '../auth/entities/user.entity';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: {
            createTeamTask: jest.fn().mockResolvedValue(mockTask),
            getTeamTasks: jest.fn().mockResolvedValue([mockTask]),
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
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      priority: 1,
    };

    it('should create a team task successfully', async () => {
      const result = await controller.createTeamTask(1, createTaskDto, mockUser);
      
      expect(result).toEqual({
        success: true,
        data: {
          taskId: mockTask.id,
          message: 'Team task created successfully.',
        },
      });
      expect(service.createTeamTask).toHaveBeenCalledWith(1, createTaskDto, mockUser.id);
    });
  });

  describe('getTeamTasks', () => {
    it('should return team tasks successfully', async () => {
      const result = await controller.getTeamTasks(1, mockUser);
      
      expect(result).toEqual({
        success: true,
        data: {
          tasks: [mockTask],
        },
      });
      expect(service.getTeamTasks).toHaveBeenCalledWith(1, mockUser.id);
    });
  });
});