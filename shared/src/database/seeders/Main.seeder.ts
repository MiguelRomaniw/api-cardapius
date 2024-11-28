import { Seeder, runSeeder } from "typeorm-extension";
import { clearDatabase } from "../utils/clearDatabase";
import { clearUploads } from "../utils/clearUploads";
import { AdditionalSeeder } from "./Additional.seeder";
import { CategorySeeder } from "./Category.seeder";
import { CompanySeeder } from "./Company.seeder";
import { ManagerSeeder } from "./Manager.seeder";
import { MenuSeeder } from "./Menu.seeder";
import { ProductSeeder } from "./Product.seeder";
import { CustomerSeeder } from "./Customer.seeder";
import { OrderSeeder } from "./Order.seeder";
import { dataSource } from "../app-data-source";
import { DataSource } from "typeorm";

declare global {
  interface Array<T> {
    random(options?: { min: number; max: number; unique: boolean }): T[];
  }
}

Array.prototype.random = function (
  { min, max, unique }: { min: number; max: number; unique: boolean } = { min: 1, max: 1, unique: false }
) {
  const array = this.valueOf() as [];
  const randomIndexes = Array(min + Math.floor(Math.random() * (max - min)))
    .fill(false)
    .map(() => {
      return Math.floor(Math.random() * array.length);
    });
  const indexes = unique ? [...new Set(randomIndexes)] : randomIndexes;
  const items = indexes.map((i) => array[i]);

  return items;
};

export class MainSeeder implements Seeder {
  async run(): Promise<any> {
    try {
      console.time("Seed");

      await clearUploads();
      await clearDatabase();

      await runSeeder(dataSource, ManagerSeeder);
      await runSeeder(dataSource, CompanySeeder);
      await runSeeder(dataSource, AdditionalSeeder);
      await runSeeder(dataSource, CategorySeeder);
      await runSeeder(dataSource, ProductSeeder);
      await runSeeder(dataSource, MenuSeeder);
      await runSeeder(dataSource, CustomerSeeder);
      await runSeeder(dataSource, OrderSeeder);

      console.timeEnd("Seed");
    } catch (error) {
      console.log(error);
    }
  }
}
