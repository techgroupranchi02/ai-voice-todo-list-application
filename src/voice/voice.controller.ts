import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('voice')
  async createFromVoice(@Body() createVoiceTaskDto: CreateVoiceTaskDto, @Request() req) {
    const userId = req.user.id;
    const result = await this.voiceService.createTaskFromVoice(createVoiceTaskDto, userId);
    return {
      success: true,
      data: result,
    };
  }
}