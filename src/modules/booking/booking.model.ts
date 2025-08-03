import { Schema, model, Types, Document } from "mongoose";
import { BookingStatus } from "./bookings.types";

export interface BookingDocument extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  slot: Types.ObjectId;
  service: Types.ObjectId;
  provider: Types.ObjectId;
  status: BookingStatus;
  hasReminderBeenSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<BookingDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hasReminderBeenSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

bookingSchema.index(
  { slot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: BookingStatus.PENDING },
  }
);

export const BookingModel = model<BookingDocument>("Booking", bookingSchema);
