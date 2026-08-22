import { CreateUsersTable1700000000001 } from './1700000000001-create-users-table';
import { QueryRunner, Table } from 'typeorm';

describe('CreateUsersTable1700000000001', () => {
  let migration: CreateUsersTable1700000000001;
  let queryRunner: QueryRunner;

  beforeEach(() => {
    migration = new CreateUsersTable1700000000001();
    queryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as QueryRunner;
  });

  it('should create users table with correct columns', async () => {
    await migration.up(queryRunner);
    
    expect(queryRunner.createTable).toHaveBeenCalledWith(
      expect.any(Table),
      true,
    );
  });

  it('should drop users table in down migration', async () => {
    await migration.down(queryRunner);
    
    expect(queryRunner.dropTable).toHaveBeenCalledWith(
      'users',
      true,
      true,
      true,
    );
  });
});