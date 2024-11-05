import mongoose, { Schema } from "mongoose";
import { Document, Types } from 'mongoose';
import { RentSize, RentStatus } from "../types/enums";

export interface IRent extends Document {
  lockerId: Types.ObjectId;
  weight: number;
  size: RentSize;
  status: RentStatus;
}

const RentSchema = new Schema<IRent>({
    lockerId: { type: Schema.Types.ObjectId, ref: 'Locker', required: true },
    weight: { type: Number, required: true, min: 0 },
    size: { type: String, enum: Object.values(RentSize), required: true },
    status: { type: String, enum: Object.values(RentStatus), required: true },
  });
  
export const Rent = mongoose.model<IRent>("Rent", RentSchema);