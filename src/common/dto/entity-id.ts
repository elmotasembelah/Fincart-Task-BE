import { z } from "zod";
import { Types } from "mongoose";

export const entityIdDto = z
  .string()
  .min(1, "ID is required")
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ID format",
  });
