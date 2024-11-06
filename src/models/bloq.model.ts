import { model, Schema } from 'mongoose';
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface IBloq extends Document {
  _id: string;
  title: string;
  address: string;
}

const bloqSchema = new Schema<IBloq>(
  {
    _id: { 
      type: String, 
      required: true, 
      default: uuidv4 },
    title: { 
      type: String, 
      required: true },
    address: { 
      type: String, 
      required: true }
  },
  {
    timestamps: true,
    _id: false
  }
);

export const Bloq = model<IBloq>('Bloq', bloqSchema);