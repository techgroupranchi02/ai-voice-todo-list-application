import { Test, TestingModule } from '@nestjs/testing';
import { UsersTable1700000000001 } from './001_users_table';
import { QueryRunner } from 'typeorm';

describe('UsersTable Migration', () => {
  let migration: UsersTable1700000000001;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersTable1700000000001],
    }).compile();

    migration = module.get<UsersTable1700000000001>(UsersTable1700000000001);
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
    it('should create users table with correct schema', async () => {
      await migration.up(queryRunner);
      
      expect(queryRunner.createTable).toHaveBeenCalled();
      // Additional assertions can be added to verify the exact table structure
    });
  });

  describe('down', () => {
    it('should drop users table', async () => {
      await migration.down(queryRunner);
      
      expect(queryRunner.dropTable).toHaveBeenCalledWith('users');
    });
  });
});