import { z } from "zod";
import { entityIdDto } from "../../../common/dto/entity-id";

export const getServiceDto = z.object({
  params: z.object({
    serviceId: entityIdDto,
  }),
});

export type getServiceParams = z.infer<typeof getServiceDto>["params"];
