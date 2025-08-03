import { Types } from "mongoose";
import { CreateServiceDto } from "./dto/create-service.dto";
import { normalizeService } from "./helpers/normalize-service.helper";
import { ServiceModel } from "./service.model";
import { deleteFile, uploadFile } from "../../common/aws/s3";
import { ApiError } from "../../common/errors/api-error";
import { GetAllServicesParams, GetMyServicesParams } from "./service.types";
import { buildServiceQuery } from "./helpers/build-services-query.helper";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { handleImageUpdate } from "../../common/helpers/handle-image-update.helper";
import config from "config";

const defaultPageSize = config.get<number>("pagination.defaultPageSize");

export const createService = async (
  data: CreateServiceDto & { provider: Types.ObjectId },
  file?: Express.Multer.File
) => {
  let imageKey: string | undefined;

  if (file) {
    imageKey = await uploadFile(file.buffer, file.originalname, file.mimetype);
  }

  const createdService = await ServiceModel.create({
    ...data,
    image: imageKey,
  });

  await createdService.populate("provider", "fullName email");

  return normalizeService(createdService);
};

export const getAllServices = async ({
  filters,
  page = 1,
  pageSize = defaultPageSize,
}: GetAllServicesParams) => {
  const skip = (page - 1) * pageSize;

  const query = buildServiceQuery(filters);

  const services = await ServiceModel.find(query)
    .populate("provider")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize + 1);

  const hasNextPage = services.length > pageSize;
  const trimmedServices = hasNextPage ? services.slice(0, pageSize) : services;

  const normalizedServices = await Promise.all(
    trimmedServices.map(normalizeService)
  );

  return {
    data: normalizedServices,
    pagination: {
      page,
      pageSize,
      hasNextPage,
    },
  };
};

export const getMyServices = async ({
  userId,
  filters,
  page = 1,
  pageSize = defaultPageSize,
}: GetMyServicesParams) => {
  const skip = (page - 1) * pageSize;

  const query = buildServiceQuery({
    ...filters,
    providerId: userId,
  });

  const services = await ServiceModel.find(query)
    .populate("provider")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize + 1);

  const hasNextPage = services.length > pageSize;
  const trimmedServices = hasNextPage ? services.slice(0, pageSize) : services;

  const normalizedServices = await Promise.all(
    trimmedServices.map(normalizeService)
  );

  return {
    data: normalizedServices,
    pagination: {
      page,
      pageSize,
      hasNextPage,
    },
  };
};

export const getService = async (serviceId: Types.ObjectId | string) => {
  const service = await ServiceModel.findById(serviceId).populate("provider");

  if (!service) {
    throw new ApiError("Service not found", 404);
  }

  return normalizeService(service);
};

export const updateService = async (
  serviceId: string,
  data: UpdateServiceDto,
  file: Express.Multer.File | undefined,
  currentUserId: string
) => {
  const existing = await ServiceModel.findById(serviceId);

  if (!existing) {
    throw new ApiError("Service not found", 404);
  }

  if (existing.provider.toString() !== currentUserId) {
    throw new ApiError("You are not authorized to update this service", 403);
  }

  if (file) {
    const newImageKey = await handleImageUpdate(existing.image, file);
    existing.image = newImageKey;
  }

  Object.assign(existing, data);
  await existing.save();
  await existing.populate("provider");

  return normalizeService(existing);
};

export const deleteService = async (serviceId: string, userId: string) => {
  const service = await ServiceModel.findById(serviceId);

  if (!service) {
    throw new ApiError("Service not found", 404);
  }

  if (service.provider.toString() !== userId) {
    throw new ApiError("You are not authorized to delete this service", 403);
  }

  if (service.image) {
    await deleteFile(service.image);
  }

  await service.deleteOne();

  return {
    id: service._id.toString(),
    title: service.title,
  };
};
