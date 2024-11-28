import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { BaseSeeder } from "./seeders/BaseSeeder";

export const dataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  entities: [`${__dirname}/entities/*.{js,ts}`],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
  seeds: [BaseSeeder],
} as DataSourceOptions & SeederOptions);
