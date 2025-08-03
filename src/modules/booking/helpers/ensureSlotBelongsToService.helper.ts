import { ApiError } from "../../../common/errors/api-error";
import { slotBelongsToService } from "../../slot/slot.repo";

export async function ensureSlotBelongsToService(
  slotId: string,
  serviceId: string
) {
  const isValid = await slotBelongsToService(slotId, serviceId);
  if (!isValid) throw new ApiError("Slot does not belong to the service", 400);
}
