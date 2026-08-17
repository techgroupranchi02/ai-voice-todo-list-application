// src/teams/teams.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new task within a team
   * @param teamId The ID of the team
   * @param taskData The task data to create
   * @returns The created task
   */
  async createTeamTask(teamId: string, taskData: any): Promise<Task> {
    // Validate that the team exists (in this case, we'll assume team exists)
    // In a real implementation, you would check if the team exists in the database
    
    const newTask = this.taskRepository.create({
      ...taskData,
      userId: taskData.assigneeId, // Assign to the specified user
    });

    return await this.taskRepository.save(newTask);
  }

  /**
   * Gets all tasks for a specific team
   * @param teamId The ID of the team
   * @returns Array of tasks for the team
   */
  async getTeamTasks(teamId: string): Promise<Task[]> {
    // In a real implementation, you would join with team members table
    // For now, we'll return all tasks (this is a simplified version)
    return await this.taskRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Assigns a task to a team member
   * @param taskId The ID of the task
   * @param assigneeId The ID of the user to assign the task to
   * @returns The updated task
   */
  async assignTaskToMember(taskId: string, assigneeId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Validate that the assignee exists
    const assignee = await this.userRepository.findOne({
      where: { id: assigneeId },
    });

    if (!assignee) {
      throw new NotFoundException('Assignee not found');
    }

    task.userId = assigneeId;
    return await this.taskRepository.save(task);
  }
}