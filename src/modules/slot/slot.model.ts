import { Schema, model, Types, Document } from "mongoose";

export interface SlotDocument extends Document {
  _id: Types.ObjectId;
  service: Types.ObjectId;
  provider: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const slotSchema = new Schema<SlotDocument>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

slotSchema.index({ provider: 1, service: 1, startTime: 1 }, { unique: true });

export const SlotModel = model<SlotDocument>("Slot", slotSchema);
