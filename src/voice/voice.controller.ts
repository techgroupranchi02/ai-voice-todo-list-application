// src/voice/voice.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('tasks')
  @UseGuards(AuthGuard)
  async createTaskFromVoice(
    @Body() body: { audioData: string },
    @Request() req,
  ) {
    try {
      const task = await this.voiceService.processVoiceInput(body.audioData);
      
      return {
        success: true,
        data: {
          taskId: task.id,
          message: 'Task created from voice input successfully.',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error.message || 'Error processing the audio data.',
          statusCode: 500,
        },
      };
    }
  }
}