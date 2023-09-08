import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1694181482434 implements MigrationInterface {
    name = 'Init1694181482434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "url_shorten" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullUrl" character varying NOT NULL, "shortenedUrl" character varying NOT NULL, CONSTRAINT "PK_7c29d59a79cd5173a84846b9148" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "url_shorten"`);
    }

}
