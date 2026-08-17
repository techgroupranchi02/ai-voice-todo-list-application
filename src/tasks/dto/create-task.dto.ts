import { IsNotEmpty, IsOptional, IsDate, IsNumber, IsBoolean, IsString } from 'class-validator';

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

  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  @IsNotEmpty()
  user: any; // This will be the user object from JWT
}