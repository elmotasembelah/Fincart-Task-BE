import { z } from "zod";
import { categoryDto } from "./fields/category.dto";
import { priceDto } from "./fields/price.dto";
import { imageDto } from "../../../common/dto/image.dto";

export const createServiceDto = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }),
    description: z.string().optional(),
    price: priceDto,
    category: categoryDto,
  }),
  file: imageDto.optional(),
});

export type CreateServiceDto = z.infer<typeof createServiceDto>["body"];
