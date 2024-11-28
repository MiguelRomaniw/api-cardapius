import { faker } from "@faker-js/faker";

import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Company, Additional } from "../entities";

export class AdditionalSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const companyRepository = dataSource.getRepository(Company);
    const additionalRepository = dataSource.getRepository(Additional);

    const companies = await companyRepository.find();

    const additionalData = companies.reduce((array: Additional[], company: Company) => {
      array.push(
        ...Array(faker.number.int({ min: 10, max: 40 }))
          .fill(false)
          .map((): Additional => {
            return additionalRepository.create({
              companyId: company.id,
              name: faker.commerce.productName(),
              price: faker.number.float({
                min: 1,
                max: 6,
                precision: 2,
              }),
              description: faker.lorem.words({ min: 1, max: 6 }),
            });
          })
      );

      return array;
    }, [] as Additional[]);

    console.log(additionalData);

    await additionalRepository.save(additionalData);
  }
}
