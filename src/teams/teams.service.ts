import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Task } from '../tasks/entities/task.entity';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { Repository } from 'typeorm';
import { TaskRepository } from '../tasks/repositories/task.repository';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private taskRepository: TaskRepository,
  ) {}

  async createTeamTask(teamId: number, createTeamTaskDto: CreateTeamTaskDto): Promise<Task> {
    // Check if team exists
    const team = await this.teamRepository.findOne({ where: { id: teamId } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // Create task with team context
    const taskData = {
      ...createTeamTaskDto,
      userId: parseInt(createTeamTaskDto.assigneeId) || null, // Convert assigneeId to number or null
    };

    return await this.taskRepository.createTask(taskData);
  }

  async getTeamById(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }
}