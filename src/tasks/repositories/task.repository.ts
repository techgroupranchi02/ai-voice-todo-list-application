import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { userId, title, description, dueDate, priority, category } = createTaskDto;

    const task = new Task();
    task.userId = userId;
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.category = category;
    task.completed = false;

    try {
      return await task.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Task already exists');
      } else {
        throw new InternalServerErrorException('Error creating task');
      }
    }
  }

  async findTaskById(id: number): Promise<Task> {
    return await this.findOne({ where: { id } });
  }

  async findTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ where: { userId } });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findTaskById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    
    try {
      return await task.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Task with this title already exists');
      } else {
        throw new InternalServerErrorException('Error updating task');
      }
    }
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.delete({ id });
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
    
    try {
      return await task.save();
    } catch (error) {
      throw new InternalServerErrorException('Error updating task completion status');
    }
  }

  async findCompletedTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ 
      where: { userId, completed: true } 
    });
  }

  async findPendingTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ 
      where: { userId, completed: false } 
    });
  }
}