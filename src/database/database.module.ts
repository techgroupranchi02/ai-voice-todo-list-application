import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'voice_user',
      password: process.env.DB_PASSWORD || 'voice_password',
      database: process.env.DB_NAME || 'voice_assistant_db',
      entities: [User, Task, Category],
      synchronize: false, // Should be false in production
      logging: false,
    }),
    TypeOrmModule.forFeature([User, Task, Category]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}