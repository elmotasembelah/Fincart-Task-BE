import { z } from "zod";
import config from "config";

const maxSizeInBytes = config.get<number>("files.images.maxSizeInBytes");
const allowedMimeTypes = config.get<string[]>("files.images.allowedMimeTypes");
const validExtentions = config.get<string[]>("files.images.validExtentions");

export const imageDto = z
  .custom<Express.Multer.File | undefined>(
    (file) => !file || typeof file === "object"
  )
  .refine(
    (file) => {
      if (!file) return true;
      const mimetype = file.mimetype?.toLowerCase();
      const filename = file.originalname?.toLowerCase() || "";
      const isValidMime = allowedMimeTypes.includes(mimetype);
      const isValidExt = validExtentions.some((ext) => filename.endsWith(ext));
      return isValidMime || isValidExt;
    },
    {
      message: "Unsupported image type. Allowed: JPG, JPEG, PNG, WEBP",
    }
  )
  .refine((file) => !file || file.size <= maxSizeInBytes, {
    message: "Image must be less than 3MB",
  });
