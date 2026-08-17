import { IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @IsOptional()
  category: string;

  @IsOptional()
  completed: boolean;
}