import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.id;
    const task = await this.tasksService.create(createTaskDto, userId);
    return {
      success: true,
      data: {
        taskId: task.id,
        message: 'Task created successfully.',
      },
    };
  }
}