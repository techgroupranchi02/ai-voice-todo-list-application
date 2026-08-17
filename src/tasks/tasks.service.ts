import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.createTask(createTaskDto);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.findAllTasks();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findTaskById(id);
      
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      
      return task;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.taskRepository.updateTask(id, updateTaskDto);
      return task;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.taskRepository.deleteTask(id);
    } catch (error) {
      throw error;
    }
  }

  async toggleCompletion(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.toggleTaskCompletion(id);
      return task;
    } catch (error) {
      throw error;
    }
  }
}