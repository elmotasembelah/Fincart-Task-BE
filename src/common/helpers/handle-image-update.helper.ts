import { deleteFile, uploadFile } from "../aws/s3";

export const handleImageUpdate = async (
  oldKey: string | undefined,
  file: Express.Multer.File
): Promise<string> => {
  const newName = file.originalname;

  if (oldKey && oldKey.includes(newName)) {
    return oldKey;
  }

  if (oldKey) {
    await deleteFile(oldKey);
  }

  return await uploadFile(file.buffer, newName, file.mimetype);
};
