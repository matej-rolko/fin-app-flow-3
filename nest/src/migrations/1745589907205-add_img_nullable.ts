import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImgNullable1745589907205 implements MigrationInterface {
    name = 'AddImgNullable1745589907205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" ADD "img" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" DROP COLUMN "img"`);
    }

}
