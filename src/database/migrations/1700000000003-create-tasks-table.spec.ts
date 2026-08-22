import { CreateTasksTable1700000000003 } from './1700000000003-create-tasks-table';
import { QueryRunner, Table } from 'typeorm';

describe('CreateTasksTable1700000000003', () => {
  let migration: CreateTasksTable1700000000003;
  let queryRunner: QueryRunner;

  beforeEach(() => {
    migration = new CreateTasksTable1700000000003();
    queryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as QueryRunner;
  });

  it('should create tasks table with correct columns and foreign keys', async () => {
    await migration.up(queryRunner);
    
    expect(queryRunner.createTable).toHaveBeenCalledWith(
      expect.any(Table),
      true,
    );
  });

  it('should drop tasks table in down migration', async () => {
    await migration.down(queryRunner);
    
    expect(queryRunner.dropTable).toHaveBeenCalledWith(
      'tasks',
      true,
      true,
      true,
    );
  });
});