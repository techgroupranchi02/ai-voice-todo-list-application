import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TeamsController', () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeamsService = {
    createTeam: jest.fn(),
    findAllTeams: jest.fn(),
    findOneTeam: jest.fn(),
    updateTeam: jest.fn(),
    removeTeam: jest.fn(),
    createTaskForTeam: jest.fn(),
    findTeamTasks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create a team and return it', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Test Team',
        description: 'A test team',
      };

      const mockTeam = { id: 1, ...createTeamDto };
      
      jest.spyOn(service, 'createTeam').mockResolvedValue(mockTeam);

      const result = await controller.createTeam(createTeamDto);
      expect(result).toEqual(mockTeam);
      expect(service.createTeam).toHaveBeenCalledWith(createTeamDto);
    });
  });

  describe('findAllTeams', () => {
    it('should return all teams', async () => {
      const mockTeams = [
        { id: 1, name: 'Team 1', description: 'Description 1' },
        { id: 2, name: 'Team 2', description: 'Description 2' },
      ];

      jest.spyOn(service, 'findAllTeams').mockResolvedValue(mockTeams);

      const result = await controller.findAllTeams();
      expect(result).toEqual(mockTeams);
      expect(service.findAllTeams).toHaveBeenCalled();
    });
  });

  describe('findOneTeam', () => {
    it('should return a team by id', async () => {
      const mockTeam = { id: 1, name: 'Test Team', description: 'Description' };
      
      jest.spyOn(service, 'findOneTeam').mockResolvedValue(mockTeam);

      const result = await controller.findOneTeam(1);
      expect(result).toEqual(mockTeam);
      expect(service.findOneTeam).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when team not found', async () => {
      jest.spyOn(service, 'findOneTeam').mockRejectedValue(new NotFoundException());

      await expect(controller.findOneTeam(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTeam', () => {
    it('should update and return a team', async () => {
      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team',
        description: 'Updated description',
      };

      const mockTeam = { id: 1, ...updateTeamDto };
      
      jest.spyOn(service, 'updateTeam').mockResolvedValue(mockTeam);

      const result = await controller.updateTeam(1, updateTeamDto);
      expect(result).toEqual(mockTeam);
      expect(service.updateTeam).toHaveBeenCalledWith(1, updateTeamDto);
    });

    it('should throw NotFoundException when team not found', async () => {
      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team',
        description: 'Updated description',
      };

      jest.spyOn(service, 'updateTeam').mockRejectedValue(new NotFoundException());

      await expect(controller.updateTeam(999, updateTeamDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeTeam', () => {
    it('should remove a team successfully', async () => {
      jest.spyOn(service, 'removeTeam').mockResolvedValue(undefined);

      await expect(controller.removeTeam(1)).resolves.not.toThrow();
      expect(service.removeTeam).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when team not found', async () => {
      jest.spyOn(service, 'removeTeam').mockRejectedValue(new NotFoundException());

      await expect(controller.removeTeam(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTaskForTeam', () => {
    it('should create a task for a team and return it', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        teamId: 1,
        completed: false,
      };

      jest.spyOn(service, 'createTaskForTeam').mockResolvedValue(mockTask);

      const result = await controller.createTaskForTeam(1, {
        title: 'Test Task',
        description: 'Test Description',
      });
      
      expect(result).toEqual(mockTask);
      expect(service.createTaskForTeam).toHaveBeenCalledWith(1, {
        title: 'Test Task',
        description: 'Test Description',
      });
    });

    it('should throw NotFoundException when team not found', async () => {
      jest.spyOn(service, 'createTaskForTeam').mockRejectedValue(new NotFoundException());

      await expect(controller.createTaskForTeam(999, {
        title: 'Test Task',
        description: 'Test Description',
      })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findTeamTasks', () => {
    it('should return tasks for a team', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', teamId: 1 },
        { id: 2, title: 'Task 2', teamId: 1 },
      ];

      jest.spyOn(service, 'findTeamTasks').mockResolvedValue(mockTasks);

      const result = await controller.findTeamTasks(1);
      expect(result).toEqual(mockTasks);
      expect(service.findTeamTasks).toHaveBeenCalledWith(1);
    });
  });
});