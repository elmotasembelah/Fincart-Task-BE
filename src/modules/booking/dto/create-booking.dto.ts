import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const createBookingDto = z.object({
  body: z.object({
    service: entityIdDto,
    slot: entityIdDto,
  }),
});

export type CreateBookingDto = z.infer<typeof createBookingDto>["body"];
