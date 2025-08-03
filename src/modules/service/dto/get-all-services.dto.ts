import z from "zod";
import { categoryDto } from "./fields/category.dto";
import { pageDto, pageSizeDto } from "../../../common/dto/pagination.dto";

export const getAllServicesDto = z.object({
  query: z.object({
    title: z.string().trim().min(1).optional(),
    category: categoryDto.optional(),
    page: pageDto,
    pageSize: pageSizeDto,
  }),
});

export type GetAllServicesDto = z.infer<typeof getAllServicesDto>["query"];
