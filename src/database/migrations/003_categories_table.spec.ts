import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTable1700000000003 } from './003_categories_table';
import { QueryRunner } from 'typeorm';

describe('CategoriesTable Migration', () => {
  let migration: CategoriesTable1700000000003;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesTable1700000000003],
    }).compile();

    migration = module.get<CategoriesTable1700000000003>(CategoriesTable1700000000003);
    queryRunner = {
      createTable: jest.fn(),
      createIndex: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as QueryRunner;
  });

  it('should be defined', () => {
    expect(migration).toBeDefined();
  });

  describe('up', () => {
    it('should create categories table with correct schema', async () => {
      await migration.up(queryRunner);
      
      expect(queryRunner.createTable).toHaveBeenCalled();
      // Additional assertions can be added to verify the exact table structure
    });
  });

  describe('down', () => {
    it('should drop categories table', async () => {
      await migration.down(queryRunner);
      
      expect(queryRunner.dropTable).toHaveBeenCalledWith('categories');
    });
  });
});