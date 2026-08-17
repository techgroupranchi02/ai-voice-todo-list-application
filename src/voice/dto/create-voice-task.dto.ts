// src/voice/dto/create-voice-task.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoiceTaskDto {
  @IsNotEmpty({ message: 'Audio data is required.' })
  @IsString({ message: 'Audio data must be a string.' })
  audioData: string;

  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Transcript must be a string.' })
  transcript?: string;
}