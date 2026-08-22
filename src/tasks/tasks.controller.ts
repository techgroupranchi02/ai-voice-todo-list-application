import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<{ success: boolean; data: Task }> {
    const task = await this.tasksService.create(createTaskDto);
    return {
      success: true,
      data: task,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; data: Task }> {
    const task = await this.tasksService.findOne(id);
    return {
      success: true,
      data: task,
    };
  }

  @Get()
  async findAll(): Promise<{ success: boolean; data: Task[] }> {
    // Note: This endpoint would typically require authentication
    // and filter by current user's tasks. For now, returning all tasks.
    const tasks = await this.tasksService.findAllByUserId(1); // Placeholder userId
    return {
      success: true,
      data: tasks,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ success: boolean; data: Task }> {
    const task = await this.tasksService.update(id, updateTaskDto);
    return {
      success: true,
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    await this.tasksService.remove(id);
    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }

  @Post(':id/toggle')
  async toggleCompletion(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: boolean; data: Task }> {
    const task = await this.tasksService.toggleCompletion(id);
    return {
      success: true,
      data: task,
    };
  }
}