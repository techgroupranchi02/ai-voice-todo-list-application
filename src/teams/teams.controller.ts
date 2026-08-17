// src/teams/teams.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * Creates a new task within a team
   * @param teamId The ID of the team
   * @param createTaskDto The task data to create
   * @returns The created task
   */
  @Post(':team_id/tasks')
  async createTeamTask(
    @Param('team_id') teamId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    try {
      const task = await this.teamsService.createTeamTask(teamId, createTaskDto);
      return {
        success: true,
        data: {
          taskId: task.id,
          message: 'Team task created successfully.',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('The specified team does not exist.');
    }
  }

  /**
   * Gets all tasks for a specific team
   * @param teamId The ID of the team
   * @returns Array of tasks for the team
   */
  @Get(':team_id/tasks')
  async getTeamTasks(@Param('team_id') teamId: string) {
    try {
      const tasks = await this.teamsService.getTeamTasks(teamId);
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      throw new NotFoundException('The specified team does not exist.');
    }
  }

  /**
   * Assigns a task to a team member
   * @param taskId The ID of the task
   * @param assigneeId The ID of the user to assign the task to
   * @returns The updated task
   */
  @Post(':team_id/tasks/:task_id/assign')
  async assignTaskToMember(
    @Param('team_id') teamId: string,
    @Param('task_id') taskId: string,
    @Body('assigneeId') assigneeId: string,
  ) {
    try {
      const task = await this.teamsService.assignTaskToMember(taskId, assigneeId);
      return {
        success: true,
        data: {
          taskId: task.id,
          message: 'Task assigned successfully.',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Task or assignee not found.');
    }
  }
}