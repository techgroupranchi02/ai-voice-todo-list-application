// src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, CreateVoiceTaskDto } from './tasks.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<{ taskId: string; message: string }> {
    const { title, description, dueDate, priority, category } = createTaskDto;

    // Validate title
    if (!title) {
      throw new NotFoundException('Title cannot be empty.');
    }

    // Create task
    const task = this.taskRepository.create({
      title,
      description,
      dueDate,
      priority,
      category,
      user,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: savedTask.id,
      message: 'Task created successfully.',
    };
  }

  async createVoiceTask(createVoiceTaskDto: CreateVoiceTaskDto, user: User): Promise<{ taskId: string; message: string }> {
    const { audioData } = createVoiceTaskDto;

    // In a real implementation, this would process the audio data
    // For now, we'll simulate processing and create a task
    
    // Simulate audio processing error (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Error processing the audio data.');
    }

    // Create a default task from voice input
    const task = this.taskRepository.create({
      title: 'Voice Task',
      description: 'Created from voice input',
      user,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: savedTask.id,
      message: 'Task created from voice input successfully.',
    };
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getTaskById(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found.');
    }
    
    return task;
  }

  async updateTask(taskId: string, userId: string, updateData: Partial<Task>): Promise<Task> {
    const task = await this.getTaskById(taskId, userId);
    
    Object.assign(task, updateData);
    
    return await this.taskRepository.save(task);
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskById(taskId, userId);
    await this.taskRepository.remove(task);
  }
}