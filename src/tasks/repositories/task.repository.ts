import { EntityRepository, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new Task();
    task.userId = createTaskDto.userId;
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.dueDate = createTaskDto.dueDate;
    task.priority = createTaskDto.priority;
    task.categoryId = createTaskDto.categoryId;
    task.completed = createTaskDto.completed || false;

    return await this.save(task);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    Object.assign(task, updateTaskDto);
    return await this.save(task);
  }

  async findTaskById(id: number): Promise<Task | undefined> {
    return await this.findOne({ where: { id } });
  }

  async findAllTasks(): Promise<Task[]> {
    return await this.find();
  }

  async findUserTasks(userId: number): Promise<Task[]> {
    return await this.find({ where: { userId } });
  }

  async deleteTask(id: number): Promise<void> {
    await this.delete(id);
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    const task = await this.findOne({ where: { id } });
    
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }

    task.completed = !task.completed;
    return await this.save(task);
  }
}