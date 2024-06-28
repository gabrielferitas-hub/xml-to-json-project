import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration1719524400436 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE \`make\` (\`makeId\` int NOT NULL, \`makeName\` varchar(255) NOT NULL, PRIMARY KEY (\`makeId\`)) ENGINE=InnoDB`);
      await queryRunner.query(`CREATE TABLE \`vehicle_type\` (\`typeId\` int NOT NULL, \`typeName\` varchar(255) NOT NULL, \`makeId\` int NULL, PRIMARY KEY (\`typeId\`)) ENGINE=InnoDB`);
      await queryRunner.query(`ALTER TABLE \`vehicle_type\` ADD CONSTRAINT \`FK_4e7281b9e0c2a9f5b8df1247d2b\` FOREIGN KEY (\`makeId\`) REFERENCES \`make\`(\`makeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`ALTER TABLE \`vehicle_type\` DROP FOREIGN KEY \`FK_4e7281b9e0c2a9f5b8df1247d2b\``);
      await queryRunner.query(`DROP TABLE \`vehicle_type\``);
      await queryRunner.query(`DROP TABLE \`make\``);
    }

}
