import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsEnum(['High', 'Medium', 'Low'])
  priority?: string;

  @IsOptional()
  category?: string;
}