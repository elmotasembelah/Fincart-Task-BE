import { Router } from "express";
import authRouter from "./modules/auth/auth.routes";
import serviceRouter from "./modules/service/service.routes";
import slotRouter from "./modules/slot/slot.routes";
import bookingRouter from "./modules/booking/booking.routes";
import userRouter from "./modules/user/user.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/services", serviceRouter);
router.use("/slots", slotRouter);
router.use("/bookings", bookingRouter);
router.use("/users", userRouter);

export default router;
