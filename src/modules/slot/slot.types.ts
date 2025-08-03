import { Role } from "../user/user.types";

export interface GetSlotsParams {
  filters: {
    service?: string;
    isBooked?: string;
  };
  page?: number;
  pageSize?: number;
}
