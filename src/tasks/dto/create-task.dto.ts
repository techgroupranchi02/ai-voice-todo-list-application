import { IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  description: string;

  @IsOptional()
  @IsDateString()
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @IsIn([0, 1, 2]) // 0 = High, 1 = Medium, 2 = Low
  @Column({ type: 'int', nullable: false, default: 0 })
  priority: number;

  @IsOptional()
  @Column({ type: 'varchar', length: 255, nullable: true })
  category: string;
}