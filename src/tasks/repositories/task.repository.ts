import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, dueDate, priority, category, completed, user } = createTaskDto;

    try {
      const task = this.create({
        title,
        description,
        dueDate,
        priority,
        category,
        completed,
        user
      });

      return await this.save(task);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Task already exists.');
      }
      throw error;
    }
  }

  async findTaskById(id: number): Promise<Task> {
    return await this.findOne({ where: { id } });
  }

  async findAllTasks(): Promise<Task[]> {
    return await this.find();
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findTaskById(id);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    Object.assign(task, updateTaskDto);
    return await this.save(task);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    const task = await this.findTaskById(id);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    task.completed = !task.completed;
    return await this.save(task);
  }
}