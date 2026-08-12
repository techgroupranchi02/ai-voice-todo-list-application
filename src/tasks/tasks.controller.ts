import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { VoiceTaskDto } from './dto/voice-task.dto';
import { AuthGuard } from '../shared/guards/auth.guard';

@Controller('api/v1/tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const result = await this.tasksService.create(createTaskDto, req.user.userId);
    return {
      success: true,
      data: result,
    };
  }

  @Post('voice')
  async createTaskFromVoice(@Body() voiceTaskDto: VoiceTaskDto, @Request() req) {
    try {
      const result = await this.tasksService.createFromVoice(voiceTaskDto, req.user.userId);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}