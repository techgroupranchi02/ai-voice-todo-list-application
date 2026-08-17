import { IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateTeamTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  priority?: number;

  @IsOptional()
  assigneeId?: string;
}