// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.providers';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'ai_voice_todo',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}