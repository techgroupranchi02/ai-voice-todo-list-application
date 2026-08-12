import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}