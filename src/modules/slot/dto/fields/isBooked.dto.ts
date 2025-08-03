import { z } from "zod";

export const isBookedDto = z.enum(["true", "false"]);
