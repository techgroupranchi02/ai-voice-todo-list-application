import { IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsIn([0, 1, 2]) // 0 = High, 1 = Medium, 2 = Low
  priority?: number;

  @IsOptional()
  category?: string;
}