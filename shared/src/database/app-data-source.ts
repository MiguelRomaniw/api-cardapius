import { DataSource, DataSourceOptions } from "typeorm";
// import { MainSeeder } from "./seeders/Main.seeder";

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
  migrations: [`${__dirname}/database/migrations/*.{js,ts}`],
  // seeds: [MainSeeder],
} as DataSourceOptions);
