import { SlotDocument } from "../slot.model";

export const normalizeSlot = (slot: SlotDocument) => {
  const obj = slot.toObject();

  return {
    id: obj._id.toString(),
    startTime: obj.startTime,
    endTime: obj.endTime,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    service:
      obj.service && typeof obj.service === "object" && "_id" in obj.service
        ? {
            id: obj.service._id.toString(),
            title: obj.service.title,
            price: obj.service.price,
          }
        : obj.service?.toString?.(),

    provider:
      obj.provider && typeof obj.provider === "object" && "_id" in obj.provider
        ? {
            id: obj.provider._id.toString(),
            fullName: obj.provider.fullName,
            email: obj.provider.email,
            role: obj.provider.role,
          }
        : obj.provider?.toString?.(),
  };
};
