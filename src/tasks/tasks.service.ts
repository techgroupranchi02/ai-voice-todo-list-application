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
      taskId: savedTask.id.toString(),
    };
  }

  async createFromVoice(createVoiceTaskDto: CreateVoiceTaskDto, userId: string): Promise<{ taskId: string }> {
    const { audioData } = createVoiceTaskDto;

    // Validate audio data
    if (!audioData || typeof audioData !== 'string') {
      throw new BadRequestException('Invalid audio data');
    }

    // Validate audio size (max 10MB)
    const audioSizeInBytes = Buffer.from(audioData, 'base64').length;
    if (audioSizeInBytes > 10 * 1024 * 1024) {
      throw new BadRequestException('Audio file too large');
    }

    // Validate audio format (basic check)
    if (!audioData.startsWith('data:audio/')) {
      throw new BadRequestException('Invalid audio format');
    }

    try {
      // In a real implementation, we would:
      // 1. Process the audio data using speech-to-text service
      // 2. Extract task details from the text
      // 3. Create the task based on extracted information
      
      // For this demo, we'll simulate processing
      const processedText = `Task created from voice input: ${audioData.substring(0, 50)}...`;
      
      // Create a simple task with the processed text
      const task = this.taskRepository.create({
        title: 'Voice Task',
        description: processedText,
        userId,
        priority: 1,
        category: 'Voice Input',
      });

      const savedTask = await this.taskRepository.save(task);
      
      return {
        taskId: savedTask.id.toString(),
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
      taskId: savedTask.id.toString(),
    };
  }
}