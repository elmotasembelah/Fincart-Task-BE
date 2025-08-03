import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const cancelBookingDto = z.object({
  params: z.object({
    bookingId: entityIdDto,
  }),
});

export type CancelBookingDto = z.infer<typeof cancelBookingDto>["params"];
