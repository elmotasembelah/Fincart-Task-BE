import { Router } from "express";
import { requireUser } from "../../common/middleware/require-user.middleware";
import { requireRole } from "../../common/middleware/require-role.middleware";
import { Role } from "../user/user.types";
import {
  createServiceController,
  getServiceController,
  getAllServicesController,
  updateServiceController,
  getMyServicesController,
  deleteServiceController,
} from "./service.controller";
import { uploadImage } from "../../common/middleware/upload-image.middleware";
import { validateRequest } from "../../common/middleware/validate-request.middleware";
import { createServiceDto } from "./dto/create-service.dto";
import { getAllServicesDto } from "./dto/get-all-services.dto";
import { updateServiceDto } from "./dto/update-service.dto";
import { deleteServiceDto } from "./dto/delete-service.dto";
import { getServiceDto } from "./dto/get-service.dto";
import { getMyServicesDto } from "./dto/get-my-services.dto";

const serviceRouter = Router();

serviceRouter.post(
  "/",
  requireUser,
  requireRole(Role.PROVIDER),
  uploadImage,
  validateRequest(createServiceDto),
  createServiceController
);

serviceRouter.get(
  "/",
  validateRequest(getAllServicesDto),
  // @ts-ignore
  getAllServicesController
);
serviceRouter.get(
  "/my",
  requireUser,
  requireRole(Role.PROVIDER),
  validateRequest(getMyServicesDto),
  // @ts-ignore
  getMyServicesController
);

serviceRouter.get(
  "/:serviceId",
  validateRequest(getServiceDto),
  getServiceController
);

serviceRouter.patch(
  "/:serviceId",
  requireUser,
  requireRole(Role.PROVIDER),
  uploadImage,
  validateRequest(updateServiceDto),
  updateServiceController
);
serviceRouter.delete(
  "/:serviceId",
  requireUser,
  requireRole(Role.PROVIDER),
  validateRequest(deleteServiceDto),
  deleteServiceController
);

export default serviceRouter;
