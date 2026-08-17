import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async createTeam(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = new Team();
    team.name = createTeamDto.name;
    team.description = createTeamDto.description;
    
    return await this.save(team);
  }

  async updateTeam(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne({ where: { id } });
    
    if (!team) {
      throw new Error(`Team with ID ${id} not found`);
    }
    
    Object.assign(team, updateTeamDto);
    
    return await this.save(team);
  }

  async findTeamById(id: string): Promise<Team> {
    return await this.findOne({ where: { id } });
  }

  async findAllTeams(): Promise<Team[]> {
    return await this.find();
  }

  async deleteTeam(id: string): Promise<void> {
    const result = await this.delete({ id });
    
    if (result.affected === 0) {
      throw new Error(`Team with ID ${id} not found`);
    }
  }
}