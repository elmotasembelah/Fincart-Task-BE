import { Role } from "../user/user.types";

export enum BookingStatus {
  PENDING = "pending",
  CANCELLED = "cancelled",
  COMPLETED = "completed",
}

export interface GetAllBookingsParams {
  userId: string;
  role: Role;
  page?: number;
  pageSize?: number;
}
