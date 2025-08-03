import { Router } from "express";
import {
  createSlotController,
  deleteSlotController,
  getSlotsController,
  updateSlotController,
} from "./slot.controller";
import { createSlotDto } from "./dto/create-slot.dto";
import { requireUser } from "../../common/middleware/require-user.middleware";
import { requireRole } from "../../common/middleware/require-role.middleware";
import { Role } from "../user/user.types";
import { validateRequest } from "../../common/middleware/validate-request.middleware";
import { getSlotsDto } from "./dto/get-slots.dto";
import { updateSlotDto } from "./dto/update-slot.dto";
import { deleteSlotDto } from "./dto/delete-slot.dto";

const slotRouter = Router();

slotRouter.post(
  "/",
  requireUser,
  requireRole(Role.PROVIDER),
  validateRequest(createSlotDto),
  createSlotController
);
slotRouter.get(
  "/",
  validateRequest(getSlotsDto),
  // @ts-ignore
  getSlotsController
);

slotRouter.patch(
  "/:slotId",
  requireUser,
  requireRole(Role.PROVIDER),
  validateRequest(updateSlotDto),
  updateSlotController
);

slotRouter.delete(
  "/:slotId",
  requireUser,
  requireRole(Role.PROVIDER),
  validateRequest(deleteSlotDto),
  deleteSlotController
);

export default slotRouter;
