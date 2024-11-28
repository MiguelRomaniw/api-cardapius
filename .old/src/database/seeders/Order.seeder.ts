import { faker } from "@faker-js/faker";

import { OrderTypes } from "Src/types/OrderTypes";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Order, Company, Customer } from "../entities";

export class OrderSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const orderRepository = dataSource.getRepository(Order);
    const companyRepository = dataSource.getRepository(Company);
    const customerRepository = dataSource.getRepository(Customer);
    const companies = await companyRepository.find();
    const customers = await customerRepository.find();

    const orderData = (
      await Promise.all(
        companies.map(async (company) => {
          return Array(faker.number.int({ min: 100, max: 300 }))
            .fill(false)
            .map((): Order => {
              const customer = customers[faker.number.int({ min: 0, max: customers.length - 1 })];

              return orderRepository.create({
                companyId: company.id,
                customerId: customer.id,
                address: customer.defaultAddress,
                paymentMethod: customer.defaultPaymentMethod,
                deliveryCost: faker.number.float({ min: 2, max: 7, precision: 0.01 }),
                price: faker.number.float({ min: 10, max: 200, precision: 0.01 }),
                details: faker.lorem.paragraph(),
                type: Object.values(OrderTypes)[faker.number.int({ min: 0, max: Object.values(OrderTypes).length - 1 })],
                createdAt: faker.date.recent({ days: 90 }).toISOString(),
              });
            });
        })
      )
    ).flat();

    await orderRepository.save(orderData);
  }
}
