import { faker } from "@faker-js/faker";
import jetpack from "fs-jetpack";

import { Jetpack } from "Src/helpers/Jetpack";
import { CompanySchedule } from "Src/types/CompanySchedule";
import { DaysOfWeek } from "Src/types/DaysOfWeek";
import { FileTypes } from "Src/types/FileTypes";
import { DataSource, Not } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { v4 } from "uuid";
import { Manager, Company, CompanyLogo, File } from "../entities";

const getBusinessDay = (day: DaysOfWeek, probability: number): CompanySchedule => {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    day,
    endAt: formatter.format(faker.date.between({ from: "2020-01-01T16:00:00.000Z", to: "2020-01-01T23:00:00.000Z" })),
    isOpen: faker.datatype.boolean(probability),
    startAt: formatter.format(faker.date.between({ from: "2020-01-01T06:00:00.000Z", to: "2020-01-01T10:00:00.000Z" })),
  };
};

export class CompanySeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const managerRepository = dataSource.getRepository(Manager);
    const companyRepository = dataSource.getRepository(Company);
    const companyLogoRepository = dataSource.getRepository(CompanyLogo);
    const fileRepository = dataSource.getRepository(File);

    const managers = await managerRepository.find({
      where: {
        cpf: Not("10558518443"),
        emailConfirmed: true,
      },
    });
    const companyData = managers.map((manager): Company => {
      return companyRepository.create({
        managerId: manager.id,
        name: faker.company.name(),
        subdomain: manager.email === "aquelino2@gmail.com" ? "space" : faker.internet.domainWord(),
        showDescription: faker.datatype.boolean(0.5),
        description: faker.lorem.paragraph(),
        contactEmail: faker.internet.email(),
        contactNumber: faker.string.numeric(13),
        hasDelivery: faker.datatype.boolean(0.9),
        hasPickUp: faker.datatype.boolean(0.95),
        websiteUrl: faker.internet.url(),
        zipCode: faker.location.zipCode("#####-###"),
        street: faker.location.street(),
        number: faker.string.numeric({ length: { min: 1, max: 3 } }),
        county: faker.location.county(),
        city: faker.location.city(),
        state: faker.location.state(),
        owner: manager,
        businessHours: [
          getBusinessDay(DaysOfWeek.Monday, 0.95),
          getBusinessDay(DaysOfWeek.Tuesday, 0.95),
          getBusinessDay(DaysOfWeek.Wednesday, 0.95),
          getBusinessDay(DaysOfWeek.Thursday, 0.95),
          getBusinessDay(DaysOfWeek.Friday, 0.95),
          getBusinessDay(DaysOfWeek.Saturday, 0.75),
          getBusinessDay(DaysOfWeek.Sunday, 0.4),
        ],
      });
    });

    const companies = await companyRepository.save(companyData);

    await Promise.all(
      companies.map(async (company) => {
        const fileName = `${v4()}.jpg`;
        const companyLogo = await companyLogoRepository.save(
          companyLogoRepository.create({
            companyId: company.id,
            fileName: fileName,
            type: FileTypes.CompanyLogo,
          })
        );

        await jetpack.copyAsync(
          `${process.env.APP_PUBLIC_PATH}/images/seed_logo_300.jpg`,
          Jetpack.filePath(`${FileTypes.CompanyLogo}/${fileName}`)
        );

        company.logo = companyLogo;
        await companyRepository.save(company);
      })
    );
  }
}
