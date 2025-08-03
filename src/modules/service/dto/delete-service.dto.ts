import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const deleteServiceDto = z.object({
  params: z.object({
    serviceId: entityIdDto,
  }),
});

export type DeleteServiceDto = z.infer<typeof deleteServiceDto>["params"];
