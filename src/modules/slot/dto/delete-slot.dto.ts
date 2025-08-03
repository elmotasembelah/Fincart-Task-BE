import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const deleteSlotDto = z.object({
  params: z.object({
    slotId: entityIdDto,
  }),
});

export type DeleteSlotDto = z.infer<typeof deleteSlotDto>["params"];
