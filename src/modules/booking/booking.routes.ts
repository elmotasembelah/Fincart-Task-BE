import express from "express";
import {
  cancelBookingController,
  createBookingController,
  getMyBookingsController,
} from "./booking.controller";
import { createBookingDto } from "./dto/create-booking.dto";
import { requireUser } from "../../common/middleware/require-user.middleware";
import { validateRequest } from "../../common/middleware/validate-request.middleware";
import { getMyBookingsDto } from "./dto/get-bookings.dto";
import { requireRole } from "../../common/middleware/require-role.middleware";
import { Role } from "../user/user.types";
import { cancelBookingDto } from "./dto/cancel-booking.dto";

const bookingRouter = express.Router();
bookingRouter.post(
  "/",
  requireUser,
  requireRole(Role.USER),
  validateRequest(createBookingDto),
  createBookingController
);
bookingRouter.get(
  "/my",
  requireUser,
  validateRequest(getMyBookingsDto),
  //@ts-ignore
  getMyBookingsController
);

bookingRouter.patch(
  "/:bookingId/cancel",
  requireUser,
  requireRole(Role.USER),
  validateRequest(cancelBookingDto),
  cancelBookingController
);

export default bookingRouter;
