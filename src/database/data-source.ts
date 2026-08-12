import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'todo_app',
  synchronize: false, // Should be false in production
  logging: false,
  entities: [User, Task],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
});