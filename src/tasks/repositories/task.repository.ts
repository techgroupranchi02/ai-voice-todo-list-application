import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../../tasks/dto/update-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.dueDate = createTaskDto.dueDate;
    task.priority = createTaskDto.priority;
    task.category = createTaskDto.category;
    task.completed = false;

    // Set the user
    task.user = { id: userId } as any;

    return await this.save(task);
  }

  async updateTask(
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne({ where: { id: taskId } });
    
    if (!task) {
      throw new Error('Task not found');
    }

    Object.assign(task, updateTaskDto);
    return await this.save(task);
  }

  async findUserTasks(userId: number): Promise<Task[]> {
    return await this.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findTaskByIdAndUserId(taskId: number, userId: number): Promise<Task> {
    return await this.findOne({
      where: { id: taskId, user: { id: userId } },
    });
  }

  async toggleTaskCompletion(taskId: number, userId: number): Promise<Task> {
    const task = await this.findTaskByIdAndUserId(taskId, userId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    task.completed = !task.completed;
    return await this.save(task);
  }

  async deleteTask(taskId: number, userId: number): Promise<void> {
    const result = await this.delete({
      id: taskId,
      user: { id: userId },
    });
    
    if (result.affected === 0) {
      throw new Error('Task not found or unauthorized');
    }
  }
}