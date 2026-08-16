import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<{ taskId: string }> {
    const { title, description, dueDate, priority, category } = createTaskDto;

    // Validate input
    if (!title || title.trim() === '') {
      throw new BadRequestException('Invalid input');
    }

    // Create task
    const task = this.taskRepository.create({
      title,
      description,
      dueDate,
      priority,
      category,
      userId,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: (savedTask as Task).id.toString(),
    };
  }

  async createFromVoice(createVoiceTaskDto: CreateVoiceTaskDto, userId: string): Promise<{ taskId: string }> {
    const { audioData, transcript, title } = createVoiceTaskDto;

    // Validate audio data
    if (!audioData || typeof audioData !== 'string') {
      throw new BadRequestException('Invalid audio data');
    }

    // Validate audio size (max 10MB)
    const base64Content = audioData.includes(',') ? audioData.split(',')[1] : audioData;
    const audioSizeInBytes = Buffer.from(base64Content, 'base64').length;
    if (audioSizeInBytes > 10 * 1024 * 1024) {
      throw new BadRequestException('Audio file too large');
    }

    // Validate audio format (basic check if data URI)
    if (audioData.startsWith('data:') && !audioData.startsWith('data:audio/')) {
      throw new BadRequestException('Invalid audio format');
    }

    try {
      const taskTitle = (title && title.trim()) || (transcript && transcript.trim()) || 'Voice Task';
      const description = (transcript && transcript.trim())
        ? `Voice Input: "${transcript.trim()}"`
        : `Task created from voice input: ${audioData.substring(0, 50)}...`;

      const task = this.taskRepository.create({
        title: taskTitle,
        description: description,
        userId,
        priority: 1,
        category: 'Voice Input',
      });

      const savedTask = await this.taskRepository.save(task);
      
      return {
        taskId: (savedTask as Task).id.toString(),
      };
    } catch (error) {
      throw new InternalServerErrorException('Audio processing error');
    }
  }

  async createInTeam(createTaskDto: CreateTaskDto, userId: string, teamId: string): Promise<{ taskId: string }> {
    const { title, description, dueDate, priority, assigneeId } = createTaskDto;

    // Validate input
    if (!title || title.trim() === '') {
      throw new BadRequestException('Invalid input');
    }

    // Create task
    const task = this.taskRepository.create({
      title,
      description,
      dueDate,
      priority,
      userId,
      assigneeId,
    });

    const savedTask = await this.taskRepository.save(task);
    
    return {
      taskId: (savedTask as Task).id.toString(),
    };
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async toggle(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new BadRequestException('Task not found');
    }
    task.completed = !task.completed;
    return this.taskRepository.save(task);
  }

  async remove(taskId: string, userId: string): Promise<{ success: boolean }> {
    await this.taskRepository.delete({ id: taskId, userId });
    return { success: true };
  }
}