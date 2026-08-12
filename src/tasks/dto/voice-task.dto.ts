import { IsNotEmpty, IsString } from 'class-validator';

export class VoiceTaskDto {
  @IsString()
  @IsNotEmpty()
  audioData: string;
}