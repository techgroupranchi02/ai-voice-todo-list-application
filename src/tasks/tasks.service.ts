import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findTaskById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async findAllByUserId(userId: number): Promise<Task[]> {
    return await this.taskRepository.findTasksByUserId(userId);
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return await this.taskRepository.updateTask(id, updateTaskDto);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.deleteTask(id);
  }

  async toggleCompletion(id: number): Promise<Task> {
    return await this.taskRepository.toggleTaskCompletion(id);
  }
}