import { BookingDocument } from "./booking.model";

export const normalizeBooking = (booking: BookingDocument): any => {
  const obj = booking.toObject();

  return {
    id: obj._id.toString(),

    user:
      obj.user && typeof obj.user === "object"
        ? {
            id: obj.user._id.toString(),
            name: obj.user.name,
            email: obj.user.email,
          }
        : obj.user?.toString(),

    provider:
      obj.provider && typeof obj.provider === "object"
        ? {
            id: obj.provider._id.toString(),
            name: obj.provider.name,
            email: obj.provider.email,
          }
        : obj.provider?.toString(),

    service:
      obj.service && typeof obj.service === "object"
        ? {
            id: obj.service._id.toString(),
            title: obj.service.title,
            category: obj.service.category,
          }
        : obj.service?.toString(),

    slot:
      obj.slot && typeof obj.slot === "object"
        ? {
            id: obj.slot._id.toString(),
            startTime: obj.slot.startTime,
            endTime: obj.slot.endTime,
            isBooked: obj.slot.isBooked,
          }
        : obj.slot?.toString(),

    status: obj.status,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};
