import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { VoiceTaskDto } from './dto/voice-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<{ taskId: string; message: string }> {
    const { title, description, dueDate, priority, category } = createTaskDto;

    // Validate required fields
    if (!title) {
      throw new Error('Title cannot be empty.');
    }

    // Create task
    const newTask = this.taskRepository.create({
      title,
      description,
      dueDate,
      priority,
      category,
      userId: userId,
    });

    const savedTask = await this.taskRepository.save(newTask);
    
    return {
      taskId: savedTask.id.toString(),
      message: 'Task created successfully.',
    };
  }

  async createFromVoice(voiceTaskDto: VoiceTaskDto, userId: string): Promise<{ taskId: string; message: string }> {
    try {
      // In a real implementation, this would process the audio data
      // For now, we'll simulate processing by parsing the base64 data
      
      const { audioData } = voiceTaskDto;
      
      if (!audioData) {
        throw new Error('Audio data is required.');
      }
      
      // Simulate audio processing - in reality this would:
      // 1. Decode base64 audio
      // 2. Send to speech-to-text service (e.g., Google Cloud Speech, AWS Transcribe)
      // 3. Process the text to extract task details
      
      // For demo purposes, we'll create a sample task
      const newTask = this.taskRepository.create({
        title: 'Voice Task',
        description: 'Created from voice input',
        dueDate: new Date(),
        priority: 1,
        category: 'Voice Input',
        userId: userId,
      });

      const savedTask = await this.taskRepository.save(newTask);
      
      return {
        taskId: savedTask.id.toString(),
        message: 'Task created from voice input successfully.',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error processing the audio data.');
    }
  }
}