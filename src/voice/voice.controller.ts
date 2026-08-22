import { Controller, Post, Body, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { VoiceService } from './voice.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateVoiceTaskDto } from './dto/create-voice-task.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Voice Input')
@Controller('tasks/voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully from voice input',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error processing the audio data',
  })
  async createTaskFromVoice(
    @Body() createVoiceTaskDto: CreateVoiceTaskDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    
    const result = await this.voiceService.processVoiceInput(
      createVoiceTaskDto.audioData,
      userId,
    );
    
    return {
      success: true,
      data: result,
    };
  }
}