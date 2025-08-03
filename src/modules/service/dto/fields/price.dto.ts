import { z } from "zod";

export const priceDto = z.preprocess(
  (val) => (val !== undefined && val !== null ? Number(val) : undefined),
  z.number({ required_error: "Price is required" }).min(0, "Price must be >= 0")
);
