import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
  ) {}

  async createTeamTask(teamId: string, createTeamTaskDto: CreateTeamTaskDto): Promise<{ taskId: string; message: string }> {
    // Validate team exists
    const team = await this.teamsRepository.findOne({
      where: { id: parseInt(teamId) },
    });

    if (!team) {
      throw new NotFoundException('The specified team does not exist.');
    }

    // Create task
    const task = this.tasksRepository.create({
      ...createTeamTaskDto,
      user_id: createTeamTaskDto.assigneeId ? parseInt(createTeamTaskDto.assigneeId) : null,
    });

    const savedTask = await this.tasksRepository.save(task);

    return {
      taskId: savedTask.id.toString(),
      message: 'Team task created successfully.',
    };
  }
}