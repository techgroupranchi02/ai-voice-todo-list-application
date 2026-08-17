import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000001 implements MigrationInterface {
  name = 'InitialMigration1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" BIGSERIAL NOT NULL,
        "first_name" VARCHAR(255) NOT NULL,
        "last_name" VARCHAR(255),
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" BIGSERIAL NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" BIGSERIAL NOT NULL,
        "user_id" BIGINT NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "due_date" TIMESTAMP,
        "priority" INTEGER NOT NULL DEFAULT 0,
        "category_id" BIGINT,
        "completed" BOOLEAN NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE INDEX "idx_email" ON "users" ("email")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "idx_user_id" ON "tasks" ("user_id")
    `);
    
    await queryRunner.query(`
      CREATE INDEX "idx_due_date" ON "tasks" ("due_date")
    `);
    
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD CONSTRAINT "FK_tasks_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    `);
    
    await queryRunner.query(`
      ALTER TABLE "tasks"
      ADD CONSTRAINT "FK_tasks_category_id"
      FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_category_id"
    `);
    
    await queryRunner.query(`
      ALTER TABLE "tasks" DROP CONSTRAINT "FK_tasks_user_id"
    `);
    
    await queryRunner.query(`
      DROP INDEX "idx_due_date"
    `);
    
    await queryRunner.query(`
      DROP INDEX "idx_user_id"
    `);
    
    await queryRunner.query(`
      DROP INDEX "idx_email"
    `);
    
    await queryRunner.query(`
      DROP TABLE "tasks"
    `);
    
    await queryRunner.query(`
      DROP TABLE "categories"
    `);
    
    await queryRunner.query(`
      DROP TABLE "users"
    `);
  }
}