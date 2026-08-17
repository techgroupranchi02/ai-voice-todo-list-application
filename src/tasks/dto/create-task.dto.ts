import { IsNotEmpty, IsOptional, IsString, IsDate, IsNumber, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsNumber()
  @IsIn([1, 2, 3]) // High, Medium, Low priority
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  category?: string;
}