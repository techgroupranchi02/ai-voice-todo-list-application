import { Controller, Post, Body, Param, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamTaskDto } from './dto/create-team-task.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post(':team_id/tasks')
  @HttpCode(HttpStatus.CREATED)
  async createTeamTask(
    @Param('team_id') teamId: string,
    @Body() createTeamTaskDto: CreateTeamTaskDto,
  ) {
    const result = await this.teamsService.createTeamTask(teamId, createTeamTaskDto);
    return {
      success: true,
      data: result,
    };
  }
}