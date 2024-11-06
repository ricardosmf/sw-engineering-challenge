import { model, Schema } from "mongoose";
import { Document } from 'mongoose';
import { RentSize, RentStatus } from "../types/enums";
import { v4 as uuidv4 } from 'uuid';

export interface IRent extends Document {
  _id: string;
  lockerId: string;
  weight: number;
  size: RentSize;
  status: RentStatus;
}

const RentSchema = new Schema<IRent>({
    _id: {
      type: String,
      default: uuidv4,
      required: true
    },
    lockerId: { 
      type: String, 
      ref: 'Locker', 
    },
    weight: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    size: { 
      type: String, 
      enum: Object.values(RentSize), 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(RentStatus), 
      required: true 
    }
}, {
    timestamps: true,
    _id: false
});

export const Rent = model<IRent>("Rent", RentSchema);