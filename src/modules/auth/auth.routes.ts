import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller";
import { validateRequest } from "../../common/middleware/validate-request.middleware";
import { registerUserRequestSchema } from "./dto/register.dto";
import { loginUserDto } from "./dto/login.dto";
import { requireUser } from "../../common/middleware/require-user.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerUserRequestSchema),
  registerController
);

authRouter.post("/login", validateRequest(loginUserDto), loginController);

authRouter.post("/logout", requireUser, logoutController);

export default authRouter;
