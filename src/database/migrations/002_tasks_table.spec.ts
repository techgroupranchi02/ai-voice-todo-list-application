import { Test, TestingModule } from '@nestjs/testing';
import { TasksTable1700000000002 } from './002_tasks_table';
import { QueryRunner } from 'typeorm';

describe('TasksTable Migration', () => {
  let migration: TasksTable1700000000002;
  let queryRunner: QueryRunner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksTable1700000000002],
    }).compile();

    migration = module.get<TasksTable1700000000002>(TasksTable1700000000002);
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
    it('should create tasks table with correct schema', async () => {
      await migration.up(queryRunner);
      
      expect(queryRunner.createTable).toHaveBeenCalled();
      // Additional assertions can be added to verify the exact table structure
    });
  });

  describe('down', () => {
    it('should drop tasks table', async () => {
      await migration.down(queryRunner);
      
      expect(queryRunner.dropTable).toHaveBeenCalledWith('tasks');
    });
  });
});