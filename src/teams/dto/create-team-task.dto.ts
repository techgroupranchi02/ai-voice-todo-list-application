import { IsNotEmpty, IsOptional, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateTeamTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsOptional()
  @IsString()
  assigneeId: string;
}