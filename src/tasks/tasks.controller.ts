import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    this.logger.log('Creating new task');
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    this.logger.log('Fetching all tasks');
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    this.logger.log(`Fetching task with ID: ${id}`);
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    this.logger.log(`Updating task with ID: ${id}`);
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/toggle')
  toggleCompletion(@Param('id') id: number) {
    this.logger.log(`Toggling completion for task with ID: ${id}`);
    return this.tasksService.toggleCompletion(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.logger.log(`Removing task with ID: ${id}`);
    return this.tasksService.remove(id);
  }
}