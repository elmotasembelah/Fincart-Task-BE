import { GetAllServicesDto } from "./dto/get-all-services.dto";
import { ServiceDocument } from "./service.model";

export enum Category {
  THERAPY = "Therapy",
  NUTRITION = "Nutrition",
  COACHING = "Coaching",
  FITNESS = "Fitness",
}

export type NormalizedService = Omit<ServiceDocument, "image"> & {
  imageUrl?: string;
};

export interface ServiceFilters {
  title?: string;
  category?: string;
  providerId?: string;
}
export interface GetAllServicesParams {
  filters: ServiceFilters;
  page: number;
  pageSize: number;
}
export interface GetMyServicesParams {
  userId: string;
  filters: ServiceFilters;
  page: number;
  pageSize: number;
}
