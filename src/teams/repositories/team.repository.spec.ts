import { Test, TestingModule } from '@nestjs/testing';
import { TeamRepository } from './team.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

describe('TeamRepository', () => {
  let repository: TeamRepository;
  const mockTeam = new Team();
  mockTeam.id = '1';
  mockTeam.name = 'Test Team';
  mockTeam.description = 'A test team for testing purposes';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamRepository,
        {
          provide: getRepositoryToken(Team),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TeamRepository>(TeamRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const createTeamDto: CreateTeamDto = {
        name: 'Test Team',
        description: 'A test team for testing purposes',
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockTeam);

      const result = await repository.createTeam(createTeamDto);
      
      expect(result).toEqual(mockTeam);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: createTeamDto.name,
        description: createTeamDto.description,
      }));
    });
  });

  describe('updateTeam', () => {
    it('should update an existing team', async () => {
      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team Name',
        description: 'Updated description',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTeam);
      jest.spyOn(repository, 'save').mockResolvedValue(mockTeam);

      const result = await repository.updateTeam('1', updateTeamDto);
      
      expect(result).toEqual(mockTeam);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: updateTeamDto.name,
        description: updateTeamDto.description,
      }));
    });

    it('should throw an error when team is not found during update', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const updateTeamDto: UpdateTeamDto = {
        name: 'Updated Team Name',
        description: 'Updated description',
      };

      await expect(repository.updateTeam('1', updateTeamDto)).rejects.toThrow(`Team with ID 1 not found`);
    });
  });

  describe('findTeamById', () => {
    it('should return a team by id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockTeam);

      const result = await repository.findTeamById('1');
      
      expect(result).toEqual(mockTeam);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('findAllTeams', () => {
    it('should return all teams', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockTeam]);

      const result = await repository.findAllTeams();
      
      expect(result).toEqual([mockTeam]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team successfully', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await expect(repository.deleteTeam('1')).resolves.not.toThrow();
      expect(repository.delete).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw an error when team is not found during deletion', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 } as any);

      await expect(repository.deleteTeam('1')).rejects.toThrow(`Team with ID 1 not found`);
    });
  });
});