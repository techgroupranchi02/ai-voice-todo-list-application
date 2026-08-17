import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryNameUniqueConstraint1700000000002 implements MigrationInterface {
  name = 'AddCategoryNameUniqueConstraint1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD CONSTRAINT "UQ_categories_name" UNIQUE ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "categories"
      DROP CONSTRAINT "UQ_categories_name"
    `);
  }
}