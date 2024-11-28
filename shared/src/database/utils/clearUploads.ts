import { FileTypes } from "Shared/types/FileTypes";
import jetpack from "fs-jetpack";

export const clearUploads = async () => {
  const fileTypes = Object.values(FileTypes);
  const uploadsPath = process.env.APP_UPLOAD_PATH!;

  await jetpack.removeAsync(uploadsPath);
  await jetpack.dirAsync(uploadsPath);

  for await (const type of fileTypes) {
    await jetpack.dirAsync(`${uploadsPath}/${type}`);
  }
};
