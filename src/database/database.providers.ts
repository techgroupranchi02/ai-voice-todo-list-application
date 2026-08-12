import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Category } from '../tasks/entities/category.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'todo_app',
        entities: [
          User,
          Task,
          Category,
        ],
        synchronize: true, // Only for development
        logging: false,
      });
      
      return dataSource.initialize();
    },
  },
];