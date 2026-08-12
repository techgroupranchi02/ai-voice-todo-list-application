// src/tasks/tasks.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, ParseUUIDPipe, Put, Delete, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, CreateVoiceTaskDto } from './tasks.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('api/v1/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    const result = await this.tasksService.createTask(createTaskDto, user);
    return {
      success: true,
      data: result,
    };
  }

  @Post('voice')
  @HttpCode(HttpStatus.CREATED)
  async createVoiceTask(@Body() createVoiceTaskDto: CreateVoiceTaskDto, @GetUser() user: User) {
    const result = await this.tasksService.createVoiceTask(createVoiceTaskDto, user);
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  async getTasks(@GetUser() user: User) {
    const tasks = await this.tasksService.getTasksByUser(user.id);
    return {
      success: true,
      data: tasks,
    };
  }

  @Get(':id')
  async getTask(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    const task = await this.tasksService.getTaskById(id, user.id);
    return {
      success: true,
      data: task,
    };
  }

  @Put(':id')
  async updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<CreateTaskDto>,
    @GetUser() user: User
  ) {
    const task = await this.tasksService.updateTask(id, user.id, updateData);
    return {
      success: true,
      data: task,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    await this.tasksService.deleteTask(id, user.id);
    return {
      success: true,
      data: null,
    };
  }
}