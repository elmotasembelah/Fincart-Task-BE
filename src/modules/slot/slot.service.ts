import { SlotModel } from "./slot.model";
import { CreateSlotDto } from "./dto/create-slot.dto";
import { Types } from "mongoose";
import { ApiError } from "../../common/errors/api-error";
import { normalizeSlot } from "./helpers/normalize-slot.helper";
import { serviceExists } from "../service/service.repo";
import config from "config";
import { Role } from "../user/user.types";
import { GetSlotsParams } from "./slot.types";
import { UpdateSlotBody } from "./dto/update-slot.dto";

const defaultPageSize = config.get<number>("pagination.defaultPageSize");

export const createSlot = async ({
  data,
  providerId,
}: {
  data: CreateSlotDto;
  providerId: string;
}) => {
  const { service, startTime, endTime } = data;

  const exists = await serviceExists(service);

  if (!exists) {
    throw new ApiError("Service not found", 404);
  }

  const newSlot = new SlotModel({
    service: new Types.ObjectId(service),
    provider: new Types.ObjectId(providerId),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  await newSlot.save();
  await newSlot.populate(["provider", "service"]);
  return normalizeSlot(newSlot);
};

export const getSlots = async ({
  filters,
  page = 1,
  pageSize = defaultPageSize,
}: GetSlotsParams) => {
  const skip = (page - 1) * pageSize;

  const query: any = {};

  if (filters.isBooked !== undefined) {
    query.isBooked = filters.isBooked === "true";
  }

  if (filters.service) {
    query.service = filters.service;
  }

  const slots = await SlotModel.find(query)
    .populate(["provider", "service"])
    .sort({ startTime: 1 })
    .skip(skip)
    .limit(pageSize + 1);

  const hasNextPage = slots.length > pageSize;
  const trimmedSlots = hasNextPage ? slots.slice(0, pageSize) : slots;

  const normalized = trimmedSlots.map(normalizeSlot);

  return {
    data: normalized,
    pagination: {
      page,
      pageSize,
      hasNextPage,
    },
  };
};

export const updateSlot = async ({
  slotId,
  providerId,
  updateData,
}: {
  slotId: string;
  providerId: string;
  updateData: UpdateSlotBody;
}) => {
  const existingSlot = await SlotModel.findById(slotId);

  if (!existingSlot) {
    throw new ApiError("Slot not found", 404);
  }

  if (existingSlot.provider.toString() !== providerId) {
    throw new ApiError("Unauthorized access to this slot", 403);
  }

  Object.assign(existingSlot, {
    ...updateData,
    startTime: updateData.startTime
      ? new Date(updateData.startTime)
      : existingSlot.startTime,
    endTime: updateData.endTime
      ? new Date(updateData.endTime)
      : existingSlot.endTime,
  });

  await existingSlot.save();
  await existingSlot.populate(["provider", "service"]);
  return normalizeSlot(existingSlot);
};

export const deleteSlot = async ({
  slotId,
  providerId,
}: {
  slotId: string;
  providerId: string;
}) => {
  const slot = await SlotModel.findById(slotId);

  if (!slot) {
    throw new ApiError("Slot not found", 404);
  }

  if (slot.provider.toString() !== providerId) {
    throw new ApiError("Unauthorized: You do not own this slot", 403);
  }

  await slot.deleteOne();

  return normalizeSlot(slot);
};
