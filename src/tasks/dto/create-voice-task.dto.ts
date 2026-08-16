import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoiceTaskDto {
  @IsString()
  @IsNotEmpty()
  audioData: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  @IsString()
  @IsOptional()
  title?: string;
}