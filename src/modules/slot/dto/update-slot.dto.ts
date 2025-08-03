import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const updateSlotDto = z.object({
  params: z.object({
    slotId: entityIdDto,
  }),
  body: z.object({
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
  }),
});

export type UpdateSlotParams = z.infer<typeof updateSlotDto>["params"];
export type UpdateSlotBody = z.infer<typeof updateSlotDto>["body"];
