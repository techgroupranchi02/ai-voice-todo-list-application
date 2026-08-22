import { IsNotEmpty, IsOptional, IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}