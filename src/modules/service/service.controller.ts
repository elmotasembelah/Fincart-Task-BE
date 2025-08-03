import { Request, Response, NextFunction } from "express";
import { CreateServiceDto } from "./dto/create-service.dto";
import {
  createService,
  deleteService,
  getAllServices,
  getMyServices,
  getService,
  updateService,
} from "./service.service";
import { GetAllServicesDto } from "./dto/get-all-services.dto";
import {
  UpdateServiceDto,
  UpdateServiceParams,
} from "./dto/update-service.dto";
import { DeleteServiceDto } from "./dto/delete-service.dto";
import { getServiceParams } from "./dto/get-service.dto";
import { GetMyServicesDto } from "./dto/get-my-services.dto";

export const createServiceController = async (
  req: Request<{}, {}, CreateServiceDto>,
  res: Response
) => {
  const providerId = res.locals.user.id;

  const service = await createService(
    {
      ...req.body,
      provider: providerId,
    },
    req.file
  );

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
};

export const getAllServicesController = async (
  req: Request<{}, {}, {}, GetAllServicesDto>,
  res: Response,
  next: NextFunction
) => {
  const { page, pageSize, ...filters } = req.query;

  const { data, pagination } = await getAllServices({
    filters,
    page,
    pageSize,
  });

  res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: data,
    pagination: pagination,
  });
};

export const getMyServicesController = async (
  req: Request<{}, {}, {}, GetMyServicesDto>,
  res: Response,
  next: NextFunction
) => {
  const { page, pageSize, ...filters } = req.query;
  const userId = res.locals.user.id;

  const { data, pagination } = await getMyServices({
    userId,
    filters,
    page,
    pageSize,
  });

  res.status(200).json({
    success: true,
    message: "Services fetched successfully",
    data: data,
    pagination: pagination,
  });
};

export const getServiceController = async (
  req: Request<getServiceParams>,
  res: Response,
  next: NextFunction
) => {
  const { serviceId } = req.params;

  const service = await getService(serviceId);

  return res.status(200).json({
    success: true,
    message: "Service deleted successfully",
    data: service,
  });
};

export const updateServiceController = async (
  req: Request<UpdateServiceParams, {}, UpdateServiceDto>,
  res: Response
) => {
  const { serviceId } = req.params;
  const data = req.body;
  const file = req.file;
  const currentUserId = res.locals.user.id;

  const service = await updateService(serviceId, data, file, currentUserId);

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
};

export const deleteServiceController = async (
  req: Request<DeleteServiceDto>,
  res: Response,
  next: NextFunction
) => {
  const { serviceId } = req.params;
  const userId = res.locals.user.id;

  const service = await deleteService(serviceId, userId);

  return res.status(200).json({
    success: true,
    message: "Service deleted successfully",
    data: service,
  });
};
