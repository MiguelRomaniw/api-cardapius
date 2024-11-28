import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "../entities";

export class BaseSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    // const repository = dataSource.getRepository(User);

    // if (
    //   await repository.exists({
    //     where: { name: "John Doe" },
    //   })
    // )
    //   return;

    // await repository.save(
    //   repository.create({
    //     name: "John Doe",
    //   })
    // );
  }
}
