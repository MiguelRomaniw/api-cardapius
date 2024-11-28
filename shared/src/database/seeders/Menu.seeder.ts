import { faker } from "@faker-js/faker";

import { MenuTypes } from "Src/types/MenuTypes";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Company, Menu, ProductGroup, Product } from "../entities";

export class MenuSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const companyRepository = dataSource.getRepository(Company);
    const menuRepository = dataSource.getRepository(Menu);
    const productGroupRepository = dataSource.getRepository(ProductGroup);
    const productRepository = dataSource.getRepository(Product);
    const companies = await companyRepository.find();

    for (const company of companies) {
      for await (const _ of Array(faker.number.int({ min: 1, max: 2 }))) {
        const menu = await menuRepository.save({
          companyId: company.id,
          title: faker.commerce.department(),
          type: Object.values(MenuTypes).random()[0],
        });
        const products = await productRepository.find({
          where: {
            companyId: company.id,
          },
        });
        const productGroups = Array(faker.number.int({ min: 6, max: 12 }))
          .fill(false)
          .map(() => {
            return productGroupRepository.create({
              companyId: company.id,
              name: faker.commerce.department(),
              menuId: menu.id,
              products: products.random({ min: 6, max: 24, unique: true }),
            });
          });

        await productGroupRepository.save(productGroups);
        await menuRepository.save(menu);
      }
    }
  }
}
