import { IsString, IsOptional, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}