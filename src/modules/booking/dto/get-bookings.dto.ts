import { z } from "zod";
import { pageDto, pageSizeDto } from "../../../common/dto/pagination.dto";

export const getMyBookingsDto = z.object({
  query: z.object({
    page: pageDto,
    pageSize: pageSizeDto,
  }),
});

export type GetMyBookingsDto = z.infer<typeof getMyBookingsDto>["query"];
