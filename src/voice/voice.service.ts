// src/voice/voice.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Task } from '../tasks/task.entity';
import { TasksService } from '../tasks/tasks.service';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);
  private readonly ollamaUrl: string;
  private readonly whisperModel: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly tasksService: TasksService,
  ) {
    this.ollamaUrl = this.configService.get<string>('OLLAMA_URL') || 'http://localhost:11434';
    this.whisperModel = this.configService.get<string>('WHISPER_MODEL') || 'tiny';
  }

  /**
   * Process voice input and create a task
   * @param audioData Base64 encoded audio data
   * @returns Created task
   */
  async processVoiceInput(audioData: string): Promise<Task> {
    try {
      this.logger.log('Processing voice input');
      
      // Convert base64 to buffer for transcription
      const buffer = Buffer.from(audioData, 'base64');
      
      // Transcribe audio using Ollama Whisper model
      const transcript = await this.transcribeAudio(buffer);
      
      // Extract task details from transcript
      const taskDetails = this.extractTaskDetails(transcript);
      
      // Create task with extracted details
      const createTaskDto: CreateTaskDto = {
        title: taskDetails.title || 'Voice Task',
        description: taskDetails.description,
        dueDate: taskDetails.dueDate,
        priority: taskDetails.priority,
        category: taskDetails.category,
      };

      // Return the created task
      return await this.tasksService.create(createTaskDto);
    } catch (error) {
      this.logger.error('Error processing voice input:', error);
      throw new Error('Error processing the audio data.');
    }
  }

  /**
   * Transcribe audio using Ollama Whisper model
   * @param buffer Audio buffer
   * @returns Transcribed text
   */
  private async transcribeAudio(buffer: Buffer): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.ollamaUrl}/api/generate`, {
          model: this.whisperModel,
          prompt: 'transcribe',
          stream: false,
          keep_alive: 0,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: buffer,
        }),
      );

      return response.data.response || '';
    } catch (error) {
      this.logger.error('Error transcribing audio:', error);
      throw new Error('Error processing the audio data.');
    }
  }

  /**
   * Extract task details from transcript using NLP
   * @param transcript Transcribed text
   * @returns Task details object
   */
  private extractTaskDetails(transcript: string): any {
    // Simple NLP extraction logic - in a real implementation, this would be more sophisticated
    const taskDetails = {
      title: '',
      description: transcript,
      dueDate: null,
      priority: 2, // Medium by default
      category: 'Personal',
    };

    // Extract title (first sentence or keyword)
    const sentences = transcript.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length > 0) {
      taskDetails.title = sentences[0].substring(0, 100); // Limit title length
    }

    // Extract priority keywords
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('immediate')) {
      taskDetails.priority = 1;
    } else if (lowerTranscript.includes('low') || lowerTranscript.includes('minor')) {
      taskDetails.priority = 3;
    }

    // Extract category keywords
    const categories = ['work', 'personal', 'shopping', 'health', 'finance'];
    for (const category of categories) {
      if (lowerTranscript.includes(category)) {
        taskDetails.category = category.charAt(0).toUpperCase() + category.slice(1);
        break;
      }
    }

    // Extract due date (simple regex pattern matching)
    const dateRegex = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}|\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g;
    const dates = transcript.match(dateRegex);
    if (dates && dates.length > 0) {
      taskDetails.dueDate = new Date(dates[0]);
    }

    return taskDetails;
  }
}