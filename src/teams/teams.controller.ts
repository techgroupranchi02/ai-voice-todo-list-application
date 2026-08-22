import { Controller, Post, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post(':team_id/tasks')
  @HttpCode(HttpStatus.CREATED)
  async createTeamTask(
    @Param('team_id') teamId: number,
    @Body() createTeamTaskDto: CreateTeamTaskDto,
  ) {
    const task = await this.teamsService.createTeamTask(teamId, createTeamTaskDto);
    
    return {
      success: true,
      data: {
        taskId: task.id,
        message: 'Team task created successfully.',
      },
    };
  }
}