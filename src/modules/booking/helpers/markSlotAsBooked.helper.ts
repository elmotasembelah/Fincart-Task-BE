import mongoose from "mongoose";

export async function markSlotAsBooked(
  slot: any,
  session: mongoose.ClientSession
) {
  slot.isBooked = true;
  await slot.save({ session });
}
