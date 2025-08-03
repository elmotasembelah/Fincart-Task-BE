import mongoose, { Types } from "mongoose";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { BookingModel } from "./booking.model";
import { ApiError } from "../../common/errors/api-error";
import config from "config";
const defaultPageSize = config.get<number>("pagination.defaultPageSize");
import { getSlotById } from "../slot/slot.repo";
import { normalizeBooking } from "./normalize-booking.helper";
import { BookingStatus, GetAllBookingsParams } from "./bookings.types";
import { Role } from "../user/user.types";
import { ensureServiceExists } from "./helpers/ensureServiceExists.helper";
import { ensureSlotExists } from "./helpers/ensureSlotExists.helper";
import { ensureSlotBelongsToService } from "./helpers/ensureSlotBelongsToService.helper";
import { ensureSameProvider } from "./helpers/ensureSameProvider.helper";
import { ensureSlotAvailable } from "./helpers/ensureSlotAvailable.helper";
import { markSlotAsBooked } from "./helpers/markSlotAsBooked.helper";

export const createBooking = async (userId: string, data: CreateBookingDto) => {
  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { service: serviceId, slot: slotId } = data;

      const service = await ensureServiceExists(serviceId);
      const slot = await ensureSlotExists(slotId);

      await ensureSlotBelongsToService(slot.id, service.id);
      ensureSameProvider(service.provider, slot.provider);
      ensureSlotAvailable(slot);

      await markSlotAsBooked(slot, session);

      let booking;
      try {
        [booking] = await BookingModel.create(
          [
            {
              ...data,
              user: userId,
              provider: service.provider,
            },
          ],
          { session }
        );
      } catch (err: any) {
        if (err.code === 11000) {
          throw new ApiError("Slot is already booked (pending)", 400);
        }
        throw err;
      }

      await booking.populate(["user", "provider", "slot", "service"]);

      await session.commitTransaction();
      session.endSession();
      return normalizeBooking(booking);
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();

      // MongoDB write conflict
      if (
        err.message?.includes("Write conflict during plan execution") &&
        attempt < MAX_RETRIES - 1
      ) {
        attempt++;
        await new Promise((res) => setTimeout(res, 100)); // small delay before retry
        continue; // retry
      }

      throw err;
    }
  }

  throw new ApiError("Failed to create booking due to write conflict", 500);
};

export const getMyBookings = async ({
  userId,
  role,
  page = 1,
  pageSize = defaultPageSize,
}: GetAllBookingsParams) => {
  const skip = (page - 1) * pageSize;

  const filter = role === Role.USER ? { user: userId } : { provider: userId };

  const bookings = await BookingModel.find(filter)
    .populate("user")
    .populate("provider")
    .populate("slot")
    .populate("service")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize + 1);

  const hasNextPage = bookings.length > pageSize;
  const trimmed = hasNextPage ? bookings.slice(0, pageSize) : bookings;

  const data = trimmed.map(normalizeBooking);

  return {
    data,
    pagination: {
      page,
      pageSize,
      hasNextPage,
    },
  };
};

export const cancelBooking = async (bookingId: string, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await BookingModel.findById(bookingId)
      .session(session)
      .populate("user provider service slot");

    if (!booking) {
      throw new ApiError("Booking not found", 404);
    }

    if (booking.user._id.toString() !== userId) {
      throw new ApiError("Only the user can cancel their booking", 403);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new ApiError("Booking is already cancelled", 400);
    }

    const slotId = booking.slot._id;
    const slot = await getSlotById(slotId);
    if (!slot) {
      throw new ApiError("Slot not found", 404);
    }

    slot.isBooked = false;
    await slot.save({ session });

    booking.status = BookingStatus.CANCELLED;
    await booking.save({ session });

    await session.commitTransaction();
    return normalizeBooking(booking);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};
