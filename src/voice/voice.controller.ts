import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../auth/entities/user.entity';

@Controller('tasks')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('voice')
  @UseGuards(AuthGuard)
  async createTaskFromVoice(
    @Body() body: { audioData: string },
    @Request() req,
  ) {
    const user: User = req.user;
    
    if (!body.audioData) {
      throw new Error('Audio data is required');
    }

    const createdTask = await this.voiceService.processVoiceInput(body.audioData, user);
    
    return {
      success: true,
      data: {
        taskId: createdTask.id,
        message: 'Task created from voice input successfully.',
      },
    };
  }
}