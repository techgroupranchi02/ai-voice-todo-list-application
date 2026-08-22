import { IsOptional, IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;
}