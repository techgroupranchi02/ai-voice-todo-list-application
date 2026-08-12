import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<{ taskId: string; message: string }> {
    // Validate input
    if (!createTaskDto.title) {
      throw new BadRequestException('Title cannot be empty.');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: savedTask.id,
      message: 'Task created successfully.',
    };
  }

  async createFromVoice(audioData: string, user: User): Promise<{ taskId: string; message: string }> {
    // Validate audio data
    if (!audioData) {
      throw new BadRequestException('Audio data is required.');
    }
    
    // Validate audio data format (base64)
    const base64Regex = /^data:audio\/[a-z]+;base64,/i;
    if (!base64Regex.test(audioData)) {
      throw new BadRequestException('Invalid audio data format. Expected base64 encoded audio.');
    }
    
    // Validate audio size (max 10MB)
    const audioSize = Buffer.from(audioData.split(',')[1], 'base64').length;
    if (audioSize > 10 * 1024 * 1024) {
      throw new BadRequestException('Audio file exceeds maximum size of 10MB.');
    }
    
    try {
      // In a real implementation, this would:
      // 1. Process the audio data with speech-to-text service
      // 2. Extract task information from the text
      // 3. Create task based on extracted information
      
      // For now, we'll simulate processing by creating a basic task
      const task = this.taskRepository.create({
        title: 'Voice Task',
        description: 'Task created from voice input',
        user,
        priority: 1, // Default priority
        completed: false,
      });
      
      const savedTask = await this.taskRepository.save(task);
      
      return {
        taskId: savedTask.id,
        message: 'Task created from voice input successfully.',
      };
    } catch (error) {
      throw new Error('Error processing the audio data.');
    }
  }

  async createTeamTask(teamId: string, createTaskDto: CreateTaskDto, user: User): Promise<{ taskId: string; message: string }> {
    // Validate input
    if (!createTaskDto.title) {
      throw new BadRequestException('Title cannot be empty.');
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: savedTask.id,
      message: 'Task created successfully.',
    };
  }

  async findAll(user: User): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found.');
    }
    
    return task;
  }

  async update(id: string, updateTaskDto: Partial<CreateTaskDto>, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    
    Object.assign(task, updateTaskDto);
    
    return await this.taskRepository.save(task);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.remove(task);
  }
}