// src/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { Priority } from '../task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  category?: string;
}