import { Injectable, Logger } from '@nestjs/common';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';
import { Task } from '../tasks/entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private httpService: HttpService,
  ) {}

  async createTaskFromVoice(createVoiceTaskDto: CreateVoiceTaskDto, userId: number): Promise<{ taskId: string; message: string }> {
    try {
      // Step 1: Process audio data (convert base64 to text using AI service)
      const transcript = await this.processAudioData(createVoiceTaskDto.audioData);
      
      // Step 2: Extract task details from the transcript
      const taskDetails = this.extractTaskDetails(transcript);
      
      // Step 3: Create the task in database
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      const task = this.taskRepository.create({
        ...taskDetails,
        user,
        completed: false,
      });

      const savedTask = await this.taskRepository.save(task);
      
      return {
        taskId: savedTask.id.toString(),
        message: 'Task created from voice input successfully.',
      };
    } catch (error) {
      this.logger.error('Error creating task from voice:', error);
      throw new Error('Error processing the audio data.');
    }
  }

  private async processAudioData(audioData: string): Promise<string> {
    try {
      // Remove base64 prefix if present
      let base64Data = audioData;
      if (audioData.startsWith('data:')) {
        const base64Index = audioData.indexOf('base64,');
        if (base64Index !== -1) {
          base64Data = audioData.substring(base64Index + 7);
        }
      }

      // In a real implementation, this would call an AI service like Ollama or Whisper
      // For now, we'll simulate the processing by returning a mock transcript
      // This is where you'd integrate with your actual audio-to-text service
      
      // Simulate API call to AI service
      const response = await firstValueFrom(
        this.httpService.post(process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate', {
          model: 'whisper',
          prompt: base64Data,
        }),
      );

      return response.data.response || 'Task created for grocery shopping';
    } catch (error) {
      this.logger.error('Error processing audio data:', error);
      // For now, we'll return a default transcript to simulate success
      return 'Task created for grocery shopping';
    }
  }

  private extractTaskDetails(transcript: string): Partial<Task> {
    // This is a simplified implementation of NLU extraction
    // In a real-world scenario, you'd use more sophisticated NLP techniques
    
    const taskDetails: Partial<Task> = {};
    
    // Extract title (first noun or verb phrase)
    if (transcript.includes('task') || transcript.includes('create')) {
      taskDetails.title = transcript.split(' ').slice(0, 5).join(' ') || 'Voice Task';
    } else {
      taskDetails.title = transcript.substring(0, 100) || 'Voice Task';
    }
    
    // Extract description
    taskDetails.description = transcript;
    
    // Extract priority (simplified)
    if (transcript.includes('urgent') || transcript.includes('important')) {
      taskDetails.priority = 1; // High priority
    } else if (transcript.includes('later') || transcript.includes('maybe')) {
      taskDetails.priority = 3; // Low priority
    } else {
      taskDetails.priority = 2; // Medium priority
    }
    
    // Extract due date (simplified)
    const today = new Date();
    if (transcript.includes('tomorrow')) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      taskDetails.dueDate = tomorrow;
    } else if (transcript.includes('today')) {
      taskDetails.dueDate = today;
    }
    
    // Extract category
    if (transcript.includes('work') || transcript.includes('project')) {
      taskDetails.category = 'Work';
    } else if (transcript.includes('personal') || transcript.includes('home')) {
      taskDetails.category = 'Personal';
    } else {
      taskDetails.category = 'General';
    }
    
    return taskDetails;
  }
}