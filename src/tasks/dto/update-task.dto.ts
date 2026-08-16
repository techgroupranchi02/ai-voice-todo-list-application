import { IsString, IsOptional, IsUUID, IsBoolean, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

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

  @IsUUID()
  @IsOptional()
  assigneeId?: string;
}
