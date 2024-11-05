import { model, Schema } from "mongoose";
import { Document, Types } from 'mongoose';
import { LockerStatus } from "../types/enums";

export interface ILocker extends Document {
  bloqId: Types.ObjectId;
  status: LockerStatus;
  isOccupied: boolean;
}

const LockerSchema = new Schema<ILocker>({
    bloqId: {
        type: Schema.Types.ObjectId,
        ref: 'Bloq',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(LockerStatus),
        default: LockerStatus.CLOSED
    },
    isOccupied: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export const Locker = model<ILocker>('Locker', LockerSchema);