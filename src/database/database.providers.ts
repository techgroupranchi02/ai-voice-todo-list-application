import { DataSource } from 'typeorm';

export const databaseProviders = [
  new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ai_voice_todo',
    entities: [
      __dirname + '/../**/*.entity{.ts,.js}',
    ],
    synchronize: true,
    logging: false,
  }),
];