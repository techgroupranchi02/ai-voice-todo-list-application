import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Task } from '../tasks/entities/task.entity';
import { TasksService } from '../tasks/tasks.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly ollamaApiUrl: string;
  private readonly ollamaModel: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly tasksService: TasksService,
  ) {
    this.ollamaApiUrl = this.configService.get<string>('OLLAMA_API_URL');
    this.ollamaModel = this.configService.get<string>('OLLAMA_MODEL');
  }

  /**
   * Process voice input and create a task
   * @param audioData Base64 encoded audio data
   * @param user The authenticated user
   * @returns Created task
   */
  async processVoiceInput(audioData: string, user: User): Promise<Task> {
    try {
      this.logger.log('Processing voice input for user: ' + user.id);
      
      // Validate audio data
      if (!audioData || typeof audioData !== 'string') {
        throw new BadRequestException('Invalid audio data provided');
      }

      // Convert audio to text using Ollama AI
      const transcript = await this.transcribeAudio(audioData);
      
      // Extract task details from transcript
      const taskDetails = this.extractTaskDetails(transcript);
      
      // Create task with extracted details
      const createdTask = await this.tasksService.createTask({
        title: taskDetails.title || 'Voice Task',
        description: taskDetails.description,
        dueDate: taskDetails.dueDate,
        priority: taskDetails.priority,
        category: taskDetails.category,
      }, user);

      this.logger.log('Voice input processed successfully for user: ' + user.id);
      return createdTask;
    } catch (error) {
      this.logger.error('Error processing voice input: ' + error.message);
      throw new InternalServerErrorException('Error processing the audio data');
    }
  }

  /**
   * Transcribe audio to text using Ollama AI
   * @param audioData Base64 encoded audio data
   * @returns Transcribed text
   */
  private async transcribeAudio(audioData: string): Promise<string> {
    try {
      // Remove data URI prefix if present
      let base64Data = audioData;
      if (audioData.startsWith('data:')) {
        const base64Index = audioData.indexOf('base64,');
        if (base64Index !== -1) {
          base64Data = audioData.substring(base64Index + 7);
        }
      }

      // Prepare the request to Ollama API
      const requestBody = {
        model: this.ollamaModel,
        prompt: `Transcribe the following speech into clear, structured text: ${base64Data}`,
        stream: false,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaApiUrl}/api/generate`, requestBody),
      );

      // Extract the transcribed text from the response
      const transcript = response.data.response || '';
      
      if (!transcript.trim()) {
        throw new InternalServerErrorException('No transcription received from AI service');
      }

      this.logger.log('Audio transcribed successfully');
      return transcript;
    } catch (error) {
      this.logger.error('Error in audio transcription: ' + error.message);
      throw new InternalServerErrorException('Error processing the audio data');
    }
  }

  /**
   * Extract task details from transcribed text
   * @param transcript Transcribed text
   * @returns Task details object
   */
  private extractTaskDetails(transcript: string): any {
    // This is a simplified implementation
    // In a real application, this would use more sophisticated NLP techniques
    
    const taskDetails = {
      title: '',
      description: '',
      dueDate: null,
      priority: 2, // Medium by default
      category: 'Personal',
    };

    // Extract title (first sentence or phrase)
    const sentences = transcript.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length > 0) {
      taskDetails.title = sentences[0].replace(/^[^a-zA-Z0-9]*/, '').substring(0, 255);
    }

    // Extract description from remaining text
    if (sentences.length > 1) {
      taskDetails.description = sentences.slice(1).join(' ').trim();
    }

    // Simple keyword-based priority detection
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('immediate')) {
      taskDetails.priority = 1; // High
    } else if (lowerTranscript.includes('low') || lowerTranscript.includes('minor')) {
      taskDetails.priority = 3; // Low
    }

    // Simple category detection
    const categories = ['work', 'personal', 'shopping', 'health', 'finance'];
    for (const category of categories) {
      if (lowerTranscript.includes(category)) {
        taskDetails.category = category.charAt(0).toUpperCase() + category.slice(1);
        break;
      }
    }

    return taskDetails;
  }
}