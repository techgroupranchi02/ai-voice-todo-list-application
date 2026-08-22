import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post(':team_id/tasks')
  async createTeamTask(
    @Param('team_id', ParseIntPipe) teamId: number,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ) {
    const task = await this.teamsService.createTeamTask(teamId, createTaskDto, user.id);
    
    return {
      success: true,
      data: {
        taskId: task.id,
        message: 'Team task created successfully.',
      },
    };
  }

  @Get(':team_id/tasks')
  async getTeamTasks(
    @Param('team_id', ParseIntPipe) teamId: number,
    @GetUser() user: User,
  ) {
    const tasks = await this.teamsService.getTeamTasks(teamId, user.id);
    
    return {
      success: true,
      data: {
        tasks,
      },
    };
  }
}