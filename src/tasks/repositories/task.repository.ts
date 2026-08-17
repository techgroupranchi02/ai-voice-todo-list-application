import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, dueDate, priority, category, completed } = createTaskDto;

    try {
      const task = this.create({
        title,
        description,
        dueDate,
        priority,
        category,
        completed,
      });

      await this.save(task);
      return task;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Task already exists.');
      } else {
        throw new InternalServerErrorException('Error creating task');
      }
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    
    if (!task) {
      throw new ConflictException('Task not found.');
    }

    Object.assign(task, updateTaskDto);
    
    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async findTaskById(id: number): Promise<Task> {
    return this.findOne({ where: { id } });
  }

  async findAllTasks(): Promise<Task[]> {
    return this.find();
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.delete(id);
    
    if (result.affected === 0) {
      throw new ConflictException('Task not found.');
    }
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    
    if (!task) {
      throw new ConflictException('Task not found.');
    }

    task.completed = !task.completed;
    
    try {
      await this.save(task);
      return task;
    } catch (error) {
      throw new InternalServerErrorException('Error toggling task completion');
    }
  }
}