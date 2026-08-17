import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      const savedTask = await this.tasksRepository.save(task);
      
      this.logger.log(`Task created successfully with ID: ${savedTask.id}`);
      return savedTask;
    } catch (error) {
      this.logger.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      
      if (!task) {
        throw new Error('Task not found');
      }

      Object.assign(task, updateTaskDto);
      const updatedTask = await this.tasksRepository.save(task);
      
      this.logger.log(`Task updated successfully with ID: ${updatedTask.id}`);
      return updatedTask;
    } catch (error) {
      this.logger.error('Error updating task:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      return task;
    } catch (error) {
      this.logger.error('Error finding task:', error);
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.tasksRepository.find();
    } catch (error) {
      this.logger.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async toggleCompletion(id: number): Promise<Task> {
    try {
      const task = await this.tasksRepository.findOne({ where: { id } });
      
      if (!task) {
        throw new Error('Task not found');
      }

      task.completed = !task.completed;
      const updatedTask = await this.tasksRepository.save(task);
      
      this.logger.log(`Task completion toggled successfully with ID: ${updatedTask.id}`);
      return updatedTask;
    } catch (error) {
      this.logger.error('Error toggling task completion:', error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.tasksRepository.delete(id);
      
      if (result.affected === 0) {
        throw new Error('Task not found');
      }
      
      this.logger.log(`Task removed successfully with ID: ${id}`);
    } catch (error) {
      this.logger.error('Error removing task:', error);
      throw error;
    }
  }
}