import { IsString, IsNotEmpty } from 'class-validator';

export class VoiceTaskDto {
  @IsString()
  @IsNotEmpty()
  audioData: string;
}