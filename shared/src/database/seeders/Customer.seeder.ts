import { faker } from "@faker-js/faker";

import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Customer, Company } from "../entities";

export class CustomerSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const customerRepository = dataSource.getRepository(Customer);
    const companyRepository = dataSource.getRepository(Company);
    const companyCount = await companyRepository.count();

    const customerData = Array(faker.number.int({ min: 60 * companyCount, max: 120 * companyCount }))
      .fill(false)
      .map((): Customer => {
        return customerRepository.create({
          name: faker.person.fullName(),
          phoneNumber: faker.string.numeric({ length: 11 }),
          defaultAddress: {
            cep: faker.location.zipCode("#####-###"),
            street: faker.location.street(),
            number: faker.string.numeric({ length: { min: 1, max: 3 } }),
            county: faker.location.county(),
            city: faker.location.city(),
            state: faker.location.state(),
            complement: faker.lorem.lines(1),
          },
          defaultPaymentMethod: ["Pix", "Crédito", "Débito", "Dinheiro"][faker.number.int({ min: 0, max: 3 })],
        });
      });

    await customerRepository.save(customerData);
  }
}
