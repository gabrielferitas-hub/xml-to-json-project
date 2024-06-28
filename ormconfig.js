const { DataSource } = require('typeorm');
require('dotenv').config();

module.exports = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/**/*.entity.js', 'src/entities/*.entity.ts'],
  migrations: ['dist/migrations/*.js', 'src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
});
