import { model, Schema } from 'mongoose';
import { Document } from "mongoose";

export interface IBloq extends Document  {
    title: string;
    address: string;
}

const bloqSchema = new Schema<IBloq>(
  {
    title: { type: String, required: true },
    address: { type: String, required: true }
  },
  { timestamps: true }
);

export const Bloq = model<IBloq>('Bloq', bloqSchema);