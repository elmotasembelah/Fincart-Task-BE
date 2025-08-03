import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadImage = upload.single("image");
