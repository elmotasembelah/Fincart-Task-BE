import { z } from "zod";
import { pageDto, pageSizeDto } from "../../../common/dto/pagination.dto";
import { entityIdDto } from "../../../common/dto/entity-id";
import { isBookedDto } from "./fields/isBooked.dto";

export const getSlotsDto = z.object({
  query: z.object({
    service: entityIdDto.optional(),
    isBooked: isBookedDto.optional(),
    page: pageDto,
    pageSize: pageSizeDto,
  }),
});

export type GetSlotsQuery = z.infer<typeof getSlotsDto>["query"];
