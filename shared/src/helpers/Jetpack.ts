import jetpack from "fs-jetpack";

export class Jetpack {
  public static path = process.env.APP_UPLOAD_PATH;
  public static url = process.env.APP_UPLOAD_URL;

  public static upload({ data, fileName }: { data: Buffer; fileName: string }) {
    return new Promise(async (resolve, reject) => {
      try {
        await jetpack.writeAsync(this.filePath(fileName), data);

        return resolve(undefined);
      } catch (error) {
        reject(error);
      }
    });
  }

  public static removeFile(fileName: string) {
    return new Promise(async (resolve, reject) => {
      try {
        await jetpack.removeAsync(this.filePath(fileName));

        resolve(undefined);
      } catch (error) {
        reject(error);
      }
    });
  }

  public static filePath(fileName: string) {
    return `${this.path}/${fileName}`;
  }

  public static fileUrl(fileName: string) {
    return `${this.url}/${fileName}`;
  }
}
