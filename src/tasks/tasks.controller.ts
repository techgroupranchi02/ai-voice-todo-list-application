import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Task } from './entities/task.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<{ success: boolean; data: Task }> {
    try {
      const task = await this.tasksService.create(createTaskDto);
      return {
        success: true,
        data: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<{ success: boolean; data: Task[] }> {
    try {
      const tasks = await this.tasksService.findAll();
      return {
        success: true,
        data: tasks,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ success: boolean; data: Task }> {
    try {
      const task = await this.tasksService.findOne(id);
      return {
        success: true,
        data: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<{ success: boolean; data: Task }> {
    try {
      const task = await this.tasksService.update(id, updateTaskDto);
      return {
        success: true,
        data: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/toggle')
  async toggleCompletion(
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: Task }> {
    try {
      const task = await this.tasksService.toggleCompletion(id);
      return {
        success: true,
        data: task,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ success: boolean; message: string }> {
    try {
      await this.tasksService.remove(id);
      return {
        success: true,
        message: 'Task deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}