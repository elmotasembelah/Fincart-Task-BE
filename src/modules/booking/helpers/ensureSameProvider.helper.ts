import { ApiError } from "../../../common/errors/api-error";

export function ensureSameProvider(serviceProvider: any, slotProvider: any) {
  if (serviceProvider.toString() !== slotProvider.toString()) {
    throw new ApiError("The slot provider is not the service provider", 400);
  }
}
