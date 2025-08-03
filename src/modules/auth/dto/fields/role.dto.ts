import { z } from "zod";
import { Role } from "../../../user/user.types";

export const roleDto = z.nativeEnum(Role);
