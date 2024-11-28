import { faker } from "@faker-js/faker";

import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Company, Category } from "../entities";

export class CategorySeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const companyRepository = dataSource.getRepository(Company);
    const categoryRepository = dataSource.getRepository(Category);

    const companies = await companyRepository.find();
    const categoryData = companies.reduce((array: Category[], company: Company) => {
      array.push(
        ...Array(faker.number.int({ min: 5, max: 20 }))
          .fill(false)
          .map((): Category => {
            return categoryRepository.create({
              companyId: company.id,
              name: faker.lorem.words({ min: 1, max: 3 }),
            });
          })
      );

      return array;
    }, [] as Category[]);

    await categoryRepository.save(categoryData);
  }
}
