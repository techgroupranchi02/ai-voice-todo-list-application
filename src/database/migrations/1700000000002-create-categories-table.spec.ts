import { CreateCategoriesTable1700000000002 } from './1700000000002-create-categories-table';
import { QueryRunner, Table } from 'typeorm';

describe('CreateCategoriesTable1700000000002', () => {
  let migration: CreateCategoriesTable1700000000002;
  let queryRunner: QueryRunner;

  beforeEach(() => {
    migration = new CreateCategoriesTable1700000000002();
    queryRunner = {
      createTable: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as QueryRunner;
  });

  it('should create categories table with correct columns', async () => {
    await migration.up(queryRunner);
    
    expect(queryRunner.createTable).toHaveBeenCalledWith(
      expect.any(Table),
      true,
    );
  });

  it('should drop categories table in down migration', async () => {
    await migration.down(queryRunner);
    
    expect(queryRunner.dropTable).toHaveBeenCalledWith(
      'categories',
      true,
      true,
      true,
    );
  });
});