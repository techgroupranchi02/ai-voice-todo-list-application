import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVoiceTaskDto {
  @IsString()
  @IsNotEmpty()
  audioData: string;
}