import { Router } from "express";
import { requireUser } from "../../common/middleware/require-user.middleware";
import { getMeController } from "./user.controller";

const userRouter = Router();

userRouter.get("/me", requireUser, getMeController);

export default userRouter;
