import { ServiceFilters } from "../service.types";

export const buildServiceQuery = (
  filters: ServiceFilters
): Record<string, any> => {
  const query: Record<string, any> = {};

  if (filters.title) {
    query.title = { $regex: filters.title, $options: "i" };
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.providerId) {
    query.provider = filters.providerId;
  }

  return query;
};
