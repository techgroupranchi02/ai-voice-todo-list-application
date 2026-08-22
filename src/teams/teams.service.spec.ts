import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Task } from '../tasks/entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('TeamsService', () => {
  let service: TeamsService;
  let teamRepository: Repository<Team>;
  let taskRepository: Repository<Task>;

  const mockTeamRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    teamRepository = module.get<Repository<Team>>(getRepositoryToken(Team));
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create and return a new team', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Test Team',
        description: 'A test team',
      };

      const mockTeam = { id: 1, ...createTeamDto };
      
      jest.spyOn(teamRepository, 'save').mockResolvedValue(mockTeam as any);

      const result = await service.createTeam(createTeamDto);
      expect(result).toEqual(mockTeam);
      expect(teamRepository.save).toHaveBeenCalledWith(createTeamDto);
    });

    it('should throw ConflictException when team name already exists', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Test Team',
        description: 'A test team',
      };

      jest.spyOn(teamRepository, 'findOne').mockResolvedValue({ id: 1, ...createTeamDto } as any);

      await expect(service.createTeam(createTeamDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllTeams', () => {
    it('should return all teams', async () => {
      const mockTeams = [
        { id: 1, name: 'Team 1', description: 'Description 1' },
        { id: 2, name: 'Team 2', description: 'Description 2' },
      ];

      jest.spyOn(teamRepository, 'find').mockResolvedValue(mockTeams as any);

      const result = await service.findAllTeams();
      expect(result).toEqual(mockTeams);
      expect(teamRepository.find).toHaveBeenCalled();
    });

    it('should return empty array when no teams exist', async () => {
      jest.spyOn(teamRepository, 'find').mockResolvedValue([]);

      const result = await service.findAllTeams();
      expect(result).toEqual([]);
    });
  });

  describe('findOneTeam', () => {
    it('should return a team by id', async () => {
      const mockTeam = { id: 1, name: 'Test Team', description: 'Description' };
      
      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(mockTeam as any);

      const result = await service.findOneTeam(1);
      expect(result).toEqual(mockTeam);
      expect(teamRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when team not found', async () => {
      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneTeam(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTeam', () => {
    it('should update and return a team', async () => {
      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team',
        description: 'Updated description',
      };

      const mockTeam = { id: 1, ...updateTeamDto };
      
      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(mockTeam as any);
      jest.spyOn(teamRepository, 'save').mockResolvedValue(mockTeam as any);

      const result = await service.updateTeam(1, updateTeamDto);
      expect(result).toEqual(mockTeam);
    });

    it('should throw NotFoundException when team not found', async () => {
      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team',
        description: 'Updated description',
      };

      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateTeam(999, updateTeamDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeTeam', () => {
    it('should remove a team successfully', async () => {
      const mockResult = { affected: 1 };
      
      jest.spyOn(teamRepository, 'delete').mockResolvedValue(mockResult as any);

      await expect(service.removeTeam(1)).resolves.not.toThrow();
      expect(teamRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when team not found', async () => {
      const mockResult = { affected: 0 };
      
      jest.spyOn(teamRepository, 'delete').mockResolvedValue(mockResult as any);

      await expect(service.removeTeam(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTaskForTeam', () => {
    it('should create a task for a team', async () => {
      const mockTeam = { id: 1, name: 'Test Team' };
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        teamId: 1,
        completed: false,
      };

      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(mockTeam as any);
      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask as any);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask as any);

      const result = await service.createTaskForTeam(1, {
        title: 'Test Task',
        description: 'Test Description',
      });
      
      expect(result).toEqual(mockTask);
      expect(teamRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(taskRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when team not found', async () => {
      jest.spyOn(teamRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createTaskForTeam(999, {
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

      jest.spyOn(taskRepository, 'find').mockResolvedValue(mockTasks as any);

      const result = await service.findTeamTasks(1);
      expect(result).toEqual(mockTasks);
      expect(taskRepository.find).toHaveBeenCalledWith({ where: { teamId: 1 } });
    });

    it('should return empty array when no tasks exist for team', async () => {
      jest.spyOn(taskRepository, 'find').mockResolvedValue([]);

      const result = await service.findTeamTasks(999);
      expect(result).toEqual([]);
    });
  });
});