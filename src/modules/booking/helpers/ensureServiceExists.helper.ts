import { ApiError } from "../../../common/errors/api-error";
import { getServiceById } from "../../service/service.repo";

export async function ensureServiceExists(serviceId: string) {
  const service = await getServiceById(serviceId);
  if (!service) throw new ApiError("Service not found", 404);
  return service;
}
