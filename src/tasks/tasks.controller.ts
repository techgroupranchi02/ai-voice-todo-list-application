import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Request() req,
  ) {
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
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    const task = await this.tasksService.findOne(id, userId);
    
    return {
      success: true,
      data: task,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
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