// src/tasks/dto/create-task.dto.ts
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  @IsString({ message: 'Title must be a string.' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date.' })
  dueDate?: Date;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH.' })
  priority?: TaskPriority;

  @IsOptional()
  @IsString({ message: 'Category must be a string.' })
  category?: string;
}