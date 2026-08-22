import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description, dueDate, priority, categoryId, userId } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.categoryId = categoryId;
    task.userId = userId;

    try {
      return await task.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Task creation failed due to constraint violation');
      } else {
        throw new InternalServerErrorException('Error creating task');
      }
    }
  }

  async findTaskById(id: number): Promise<Task> {
    return await this.findOne({ where: { id } });
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findTaskById(id);
    if (!task) {
      throw new InternalServerErrorException('Task not found');
    }
    
    Object.assign(task, updateTaskDto);
    return await task.save();
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.delete({ id });
    if (result.affected === 0) {
      throw new InternalServerErrorException('Task not found');
    }
  }

  async findTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ where: { userId } });
  }

  async findCompletedTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ 
      where: { 
        userId, 
        completed: true 
      } 
    });
  }

  async findPendingTasksByUserId(userId: number): Promise<Task[]> {
    return await this.find({ 
      where: { 
        userId, 
        completed: false 
      } 
    });
  }
}