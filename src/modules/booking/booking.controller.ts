import { Request, Response, NextFunction } from "express";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { cancelBooking, createBooking, getMyBookings } from "./booking.service";
import { GetMyBookingsDto } from "./dto/get-bookings.dto";
import { CancelBookingDto } from "./dto/cancel-booking.dto";

export const createBookingController = async (
  req: Request<{}, {}, CreateBookingDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const booking = await createBooking(userId, req.body);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
};

export const getMyBookingsController = async (
  req: Request<{}, {}, {}, GetMyBookingsDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const role = res.locals.user.role;
  const { page, pageSize } = req.query;

  const { data, pagination } = await getMyBookings({
    userId,
    role,
    page,
    pageSize,
  });

  return res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data,
    pagination,
  });
};

export const cancelBookingController = async (
  req: Request<CancelBookingDto>,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.user.id;
  const { bookingId } = req.params;

  const updatedBooking = await cancelBooking(bookingId, userId);

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: updatedBooking,
  });
};
