import { Schema, model, Types, Document } from "mongoose";

export interface ServiceDocument extends Document {
  _id: Types.ObjectId;
  provider: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<ServiceDocument>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

serviceSchema.index({ provider: 1, title: 1 }, { unique: true });

export const ServiceModel = model<ServiceDocument>("Service", serviceSchema);
