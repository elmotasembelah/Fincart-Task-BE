import dayjs from "dayjs";
import { BookingModel } from "./booking.model";

export const getPendingBookingsWithinNext30Min = async () => {
  const now = dayjs();
  const in30Min = now.add(30, "minute");

  const rawBookings = await BookingModel.aggregate([
    {
      $match: {
        status: "pending",
        hasReminderBeenSent: false,
      },
    },
    {
      $lookup: {
        from: "slots",
        localField: "slot",
        foreignField: "_id",
        as: "slot",
      },
    },
    { $unwind: "$slot" },
    {
      $match: {
        "slot.startTime": {
          $gte: now.toDate(),
          $lte: in30Min.toDate(),
        },
      },
    },
  ]);

  return await BookingModel.populate(rawBookings, [
    { path: "user" },
    { path: "provider" },
    { path: "service" },
  ]);
};
