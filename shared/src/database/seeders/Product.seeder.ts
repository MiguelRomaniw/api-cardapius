import { faker } from "@faker-js/faker";
import jetpack from "fs-jetpack";
import { Jetpack } from "Src/helpers/Jetpack";
import { FileTypes } from "Src/types/FileTypes";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { v4 } from "uuid";
import { Company, Product, Category, Additional, AdditionalGroup, ProductImage } from "../entities";

export class ProductSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const companyRepository = dataSource.getRepository(Company);
    const productRepository = dataSource.getRepository(Product);
    const categoryRepository = dataSource.getRepository(Category);
    const additionalRepository = dataSource.getRepository(Additional);
    const additionalGroupRepository = dataSource.getRepository(AdditionalGroup);
    const productImageRepository = dataSource.getRepository(ProductImage);

    const companies = await companyRepository.find();

    for (const company of companies) {
      const categories = await categoryRepository.find({
        where: {
          companyId: company.id,
        },
      });
      const additionals = await additionalRepository.find({
        where: {
          companyId: company.id,
        },
      });

      const productData = await Promise.all(
        Array(faker.number.int({ min: 20, max: 120 }))
          .fill(false)
          .map(async () => {
            const categoriesAmount = faker.number.int({ min: 0, max: 6 });
            const categoriesIndexes = [
              ...new Set(
                Array(categoriesAmount)
                  .fill(false)
                  .map(() => {
                    return Math.floor(Math.random() * categoriesAmount);
                  })
              ),
            ];
            const chosenCategories = categoriesIndexes.map((index) => categories[index]);

            const product = await productRepository.save(
              productRepository.create({
                companyId: company.id,
                name: faker.commerce.productName(),
                price: faker.number.float({
                  min: 1,
                  max: 6,
                  precision: 2,
                }),
                description: faker.lorem.words({ min: 4, max: 16 }),
                categories: chosenCategories,
                // additionalGroups: additionalGroups,
              })
            );

            const additionalsAmount = faker.number.int({ min: 4, max: 12 });
            const additionalsGroupsAmount = faker.number.int({ min: 0, max: 5 });
            const additionalGroups = Array(additionalsGroupsAmount)
              .fill(false)
              .map((): AdditionalGroup => {
                const additionalsIndexes = [
                  ...new Set(
                    Array(additionalsAmount)
                      .fill(false)
                      .map(() => {
                        return Math.floor(Math.random() * additionalsAmount);
                      })
                  ),
                ];
                const chosenAdditionals = additionalsIndexes.map((index) => additionals[index]);

                return additionalGroupRepository.create({
                  companyId: company.id,
                  productId: product.id,
                  name: faker.commerce.department(),
                  required: faker.datatype.boolean(0.7),
                  minLimit:
                    faker.number.int({
                      min: 1,
                      max: 4,
                    }) - 1,
                  maxLimit:
                    3 +
                    faker.number.int({
                      min: 0,
                      max: 3,
                    }),
                  additionals: chosenAdditionals,
                });
              });

            await additionalGroupRepository.save(additionalGroups);

            product.additionalGroups = additionalGroups;

            await productRepository.save(product);

            return product;
          })
      );

      const products = await productRepository.save(productData);

      await Promise.all(
        products.map(async (product) => {
          const fileName = `${v4()}.jpg`;
          const productImage = await productImageRepository.save(
            productImageRepository.create({
              fileName: fileName,
              type: FileTypes.ProductImage,
              productId: product.id,
            })
          );

          await jetpack.copyAsync(
            `${process.env.APP_PUBLIC_PATH}/images/seed_product_300.jpg`,
            Jetpack.filePath(`${FileTypes.ProductImage}/${fileName}`)
          );

          product.images = [productImage];
          await productRepository.save(product);
        })
      );
    }
  }
}
