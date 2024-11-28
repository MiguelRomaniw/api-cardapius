import { faker } from "@faker-js/faker";

import { Bcrypt } from "Src/helpers/Bcrypt";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Manager } from "../entities";

export class ManagerSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const managerRepository = dataSource.getRepository(Manager);
    const managerData = Array(1)
      .fill(false)
      .map((): Manager => {
        return managerRepository.create({
          email: faker.internet.email(),
          emailConfirmed: faker.datatype.boolean(0.95),
          phoneNumber: faker.string.numeric(13),
          cpf: faker.string.numeric(11),
          password: Bcrypt.hash("secret"),
        });
      });

    managerData.push(
      managerRepository.create({
        email: "aquelino2@gmail.com",
        emailConfirmed: true,
        phoneNumber: "559484293170",
        cpf: "06554834974",
        password: Bcrypt.hash("secret"),
      })
    );

    await managerRepository.save(managerData);
  }
}
