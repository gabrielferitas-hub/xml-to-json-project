import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeVehicleTypeRelation1719611996194 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`make_vehicle_type_relation\` (\`makeId\` int NOT NULL, \`typeId\` int NOT NULL, INDEX \`IDX_05ab72c19c0f62cf77efcb8b31\` (\`makeId\`), INDEX \`IDX_a52c0d6b3f810e37b76f59c41b\` (\`typeId\`), PRIMARY KEY (\`makeId\`, \`typeId\`)) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`make_vehicle_type_relation\` ADD CONSTRAINT \`FK_05ab72c19c0f62cf77efcb8b31d\` FOREIGN KEY (\`makeId\`) REFERENCES \`make\`(\`makeId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`make_vehicle_type_relation\` ADD CONSTRAINT \`FK_a52c0d6b3f810e37b76f59c41bd\` FOREIGN KEY (\`typeId\`) REFERENCES \`vehicle_type\`(\`typeId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`make_vehicle_type_relation\` DROP FOREIGN KEY \`FK_a52c0d6b3f810e37b76f59c41bd\``);
    await queryRunner.query(`ALTER TABLE \`make_vehicle_type_relation\` DROP FOREIGN KEY \`FK_05ab72c19c0f62cf77efcb8b31d\``);
    await queryRunner.query(`DROP INDEX \`IDX_a52c0d6b3f810e37b76f59c41b\` ON \`make_vehicle_type_relation\``);
    await queryRunner.query(`DROP INDEX \`IDX_05ab72c19c0f62cf77efcb8b31\` ON \`make_vehicle_type_relation\``);
    await queryRunner.query(`DROP TABLE \`make_vehicle_type_relation\``);
  }

}
