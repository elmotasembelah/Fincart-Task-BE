import { ApiError } from "../../../common/errors/api-error";

export function ensureSlotAvailable(slot: any) {
  if (slot.isBooked) {
    throw new ApiError("Slot is already booked", 400);
  }
}
