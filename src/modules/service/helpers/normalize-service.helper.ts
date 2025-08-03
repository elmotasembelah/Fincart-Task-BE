import { ServiceDocument } from "../service.model";
import { getSignedUrlForFile } from "../../../common/aws/s3";

export const normalizeService = async (service: ServiceDocument) => {
  const obj = service.toObject();

  const imageUrl = obj.image ? await getSignedUrlForFile(obj.image) : undefined;

  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    price: obj.price,
    category: obj.category,
    provider:
      obj.provider && typeof obj.provider === "object" && "_id" in obj.provider
        ? {
            id: obj.provider._id.toString(),
            fullName: obj.provider.fullName,
            email: obj.provider.email,
          }
        : obj.provider?.toString?.(),
    imageUrl,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};
