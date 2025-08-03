import { Types } from "mongoose";
import { SlotDocument, SlotModel } from "./slot.model";

export const slotExists = async (
  slotId: string | Types.ObjectId
): Promise<boolean> => {
  const id = typeof slotId === "string" ? new Types.ObjectId(slotId) : slotId;

  return await SlotModel.exists({ _id: id }).then(Boolean);
};

export const getSlotById = async (
  serviceId: string | Types.ObjectId
): Promise<SlotDocument | null> => {
  const id =
    typeof serviceId === "string" ? new Types.ObjectId(serviceId) : serviceId;

  return await SlotModel.findById(id).exec();
};

export const slotBelongsToService = async (
  slotId: string | Types.ObjectId,
  serviceId: string | Types.ObjectId
): Promise<boolean> => {
  const slotObjectId =
    typeof slotId === "string" ? new Types.ObjectId(slotId) : slotId;
  const serviceObjectId =
    typeof serviceId === "string" ? new Types.ObjectId(serviceId) : serviceId;

  return await SlotModel.exists({
    _id: slotObjectId,
    service: serviceObjectId,
  }).then(Boolean);
};
