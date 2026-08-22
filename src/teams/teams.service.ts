import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTeamTask(teamId: number, createTaskDto: CreateTaskDto, userId: number): Promise<Task> {
    // Validate that the team exists (in a real implementation, you would have a Team entity)
    // For now, we'll assume team validation is handled at the controller level
    // or through a separate team service
    
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description;
    task.dueDate = createTaskDto.dueDate;
    task.priority = createTaskDto.priority;
    task.completed = false;
    task.user = { id: userId } as User; // Associate with the user who created it

    if (createTaskDto.assigneeId) {
      const assignee = await this.userRepository.findOne({ where: { id: createTaskDto.assigneeId } });
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
      task.assignee = assignee;
    }

    return await this.taskRepository.save(task);
  }

  async getTeamTasks(teamId: number, userId: number): Promise<Task[]> {
    // In a real implementation, you would filter tasks by team membership
    // For now, we'll just return all tasks for the user
    return await this.taskRepository.find({ 
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' }
    });
  }
}