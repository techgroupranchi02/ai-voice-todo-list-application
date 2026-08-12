// src/tasks/dto/team-task.dto.ts
import { IsNotEmpty, IsString, IsDate, IsEnum, IsUUID } from 'class-validator';
import { Priority } from '../task.entity';

export class TeamTaskDto {
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

  @IsNotEmpty()
  @IsUUID()
  assigneeId: string;
}