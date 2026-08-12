// src/tasks/dto/create-voice-task.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVoiceTaskDto {
  @IsNotEmpty()
  @IsString()
  audioData: string;
}