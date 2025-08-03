import { ServiceDocument, ServiceModel } from "./service.model";
import { Types } from "mongoose";

export const serviceExists = async (
  serviceId: string | Types.ObjectId
): Promise<boolean> => {
  const id =
    typeof serviceId === "string" ? new Types.ObjectId(serviceId) : serviceId;
  return await ServiceModel.exists({ _id: id }).then(Boolean);
};

export const getServiceById = async (
  serviceId: string | Types.ObjectId
): Promise<ServiceDocument | null> => {
  const id =
    typeof serviceId === "string" ? new Types.ObjectId(serviceId) : serviceId;

  return await ServiceModel.findById(id).exec();
};
