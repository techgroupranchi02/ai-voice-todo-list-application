import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamColumnToTasks1690000000002 implements MigrationInterface {
    name = 'AddTeamColumnToTasks1690000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "teamId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_teamId" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_teamId"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "teamId"`);
    }
}