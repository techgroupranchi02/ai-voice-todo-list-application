import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('api/v1/tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
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

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    const tasks = await this.tasksService.findAll(userId);
    return {
      success: true,
      data: tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    const task = await this.tasksService.findOne(id, userId);
    return {
      success: true,
      data: task,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.update(id, updateTaskDto, userId);
    return {
      success: true,
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    await this.tasksService.remove(id, userId);
    return {
      success: true,
      data: {
        message: 'Task deleted successfully.',
      },
    };
  }
}