import { z } from "zod";
import { categoryDto } from "./fields/category.dto";
import { priceDto } from "./fields/price.dto";
import { imageDto } from "../../../common/dto/image.dto";
import { entityIdDto } from "../../../common/dto/entity-id";

export const updateServiceDto = z.object({
  params: z.object({
    serviceId: entityIdDto,
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    price: priceDto.optional(),
    category: categoryDto.optional(),
  }),
  file: imageDto.optional(),
});

export type UpdateServiceDto = z.infer<typeof updateServiceDto>["body"];
export type UpdateServiceParams = z.infer<typeof updateServiceDto>["params"];
