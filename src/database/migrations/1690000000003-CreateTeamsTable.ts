import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTeamsTable1690000000003 implements MigrationInterface {
    name = 'CreateTeamsTable1690000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_1234567890abcdef1234567890abcdef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_members" ("teamId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_team_members" PRIMARY KEY ("teamId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "team_members" ADD CONSTRAINT "FK_team_members_teamId" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_members" ADD CONSTRAINT "FK_team_members_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "team_members"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }
}