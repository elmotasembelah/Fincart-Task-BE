import cron from "node-cron";
import { BookingModel } from "../booking.model";
import dayjs from "dayjs";
import { sendEmail } from "../../../common/email/email.services";
import { SlotDocument } from "../../slot/slot.model";
import { UserDocument } from "../../user/user.model";
import { bookingReminderTemplate } from "../../../common/email/templates/booking-reminder.template";
import { BookingStatus } from "../bookings.types";
import utc from "dayjs/plugin/utc";
import { getPendingBookingsWithinNext30Min } from "../bookings.repo";
import { ServiceDocument } from "../../service/service.model";

dayjs.extend(utc);

export const initBookingReminderJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    await sendBookingReminderEmails();
  });
};

export const sendBookingReminderEmails = async () => {
  const now = dayjs().utc();
  const in30Min = now.add(30, "minute");

  const bookings = await getPendingBookingsWithinNext30Min();

  for (const booking of bookings) {
    const slot = booking.slot as unknown as SlotDocument;
    const user = booking.user as unknown as UserDocument;
    const service = booking.service as unknown as ServiceDocument;
    const provider = booking.provider as unknown as UserDocument;

    const message = bookingReminderTemplate(
      slot.startTime,
      service.title,
      provider.fullName
    );

    await sendEmail(user.email, "Booking Reminder", message);

    await sendEmail(provider.email, "Booking Reminder", message);

    await BookingModel.updateOne(
      { _id: booking._id },
      { hasReminderBeenSent: true }
    );
  }
};
