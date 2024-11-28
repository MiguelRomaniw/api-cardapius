import { Jetpack } from "Src/helpers/Jetpack";
import jetpack from "fs-jetpack";
import { AfterInsert, AfterLoad, AfterRecover, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class File {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  fileName!: string;

  @Column()
  type!: string;

  url!: string;
  path!: string;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  @AfterRecover()
  setUrl() {
    this.url = Jetpack.fileUrl(`${this.type}/${this.fileName}`);
    this.path = Jetpack.filePath(`${this.type}/${this.fileName}`);
  }

  @AfterRemove()
  async unsync() {
    return new Promise(async (resolve, reject) => {
      try {
        const fileExists = await jetpack.existsAsync(this.path);

        if (!fileExists) resolve(true);

        await jetpack.removeAsync(this.path);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}
