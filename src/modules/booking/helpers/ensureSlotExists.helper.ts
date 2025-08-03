import { ApiError } from "../../../common/errors/api-error";
import { getSlotById } from "../../slot/slot.repo";

export async function ensureSlotExists(slotId: string) {
  const slot = await getSlotById(slotId);
  if (!slot) throw new ApiError("Slot not found", 404);
  return slot;
}
