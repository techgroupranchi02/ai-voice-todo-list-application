import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TaskRepository } from '../tasks/repositories/task.repository';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly ollamaBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly taskRepository: TaskRepository,
  ) {
    this.ollamaBaseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
  }

  /**
   * Process voice input and create a task
   * @param audioData Base64 encoded audio data
   * @param userId User ID of the requester
   * @returns Task creation result
   */
  async processVoiceInput(audioData: string, userId: number): Promise<{ taskId: number; message: string }> {
    try {
      // Step 1: Convert audio to text using Ollama (speech-to-text)
      const transcript = await this.convertAudioToText(audioData);
      
      // Step 2: Extract task details from the transcript
      const taskDetails = await this.extractTaskDetails(transcript);
      
      // Step 3: Create task in database
      const createTaskDto: CreateTaskDto = {
        userId,
        title: taskDetails.title || 'Voice Task',
        description: taskDetails.description,
        dueDate: taskDetails.dueDate,
        priority: taskDetails.priority || 0,
        category: taskDetails.category,
      };

      const task = await this.taskRepository.createTask(createTaskDto);
      
      return {
        taskId: task.id,
        message: 'Task created from voice input successfully.',
      };
    } catch (error) {
      this.logger.error(`Error processing voice input: ${error.message}`);
      throw error;
    }
  }

  /**
   * Convert audio data to text using Ollama
   * @param audioData Base64 encoded audio data
   * @returns Transcribed text
   */
  private async convertAudioToText(audioData: string): Promise<string> {
    try {
      // Remove data URI prefix if present
      const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, '');
      
      // Call Ollama API for speech-to-text conversion
      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaBaseUrl}/api/generate`, {
          model: 'whisper',
          prompt: base64Data,
          stream: false,
        }),
      );

      return response.data.response || '';
    } catch (error) {
      this.logger.error(`Error converting audio to text: ${error.message}`);
      throw new NotFoundException('Error processing the audio data.');
    }
  }

  /**
   * Extract task details from transcript using AI
   * @param transcript Text transcription
   * @returns Extracted task details
   */
  private async extractTaskDetails(transcript: string): Promise<any> {
    try {
      // Call Ollama API to analyze the transcript and extract task details
      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaBaseUrl}/api/generate`, {
          model: 'llama3',
          prompt: `Extract task details from this voice input: "${transcript}". Return a JSON object with title, description, dueDate (ISO format or null), priority (0=High, 1=Medium, 2=Low or null), and category (string or null).`,
          stream: false,
        }),
      );

      const result = response.data.response || '';
      
      // Try to parse the JSON from the response
      try {
        return JSON.parse(result);
      } catch {
        // If parsing fails, return a default structure with the transcript as title
        return {
          title: transcript.substring(0, 100) + (transcript.length > 100 ? '...' : ''),
          description: transcript,
          dueDate: null,
          priority: null,
          category: null,
        };
      }
    } catch (error) {
      this.logger.error(`Error extracting task details: ${error.message}`);
      
      // Return default structure if AI processing fails
      return {
        title: transcript.substring(0, 100) + (transcript.length > 100 ? '...' : ''),
        description: transcript,
        dueDate: null,
        priority: null,
        category: null,
      };
    }
  }
}