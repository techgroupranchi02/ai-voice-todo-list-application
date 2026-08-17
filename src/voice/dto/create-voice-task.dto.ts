import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVoiceTaskDto {
  @IsNotEmpty()
  audioData: string;

  @IsOptional()
  transcript?: string;

  @IsOptional()
  title?: string;
}