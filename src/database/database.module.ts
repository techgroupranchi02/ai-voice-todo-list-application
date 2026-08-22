import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false, // Should be false in production
        logging: false,
        poolSize: 10,
        ssl: configService.get<boolean>('DB_SSL'),
        extra: {
          max: 20,
          min: 5,
          acquireTimeoutMillis: 30000,
          idleTimeoutMillis: 30000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}