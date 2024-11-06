import { model, Schema } from "mongoose";
import { Document } from 'mongoose';
import { LockerStatus } from "../types/enums";
import { v4 as uuidv4 } from 'uuid';

export interface ILocker extends Document {
    _id: string;
    bloqId: string;
    status: LockerStatus;
    isOccupied: boolean;
}

const LockerSchema = new Schema<ILocker>({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    bloqId: {
        type: String,
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
    timestamps: true,
    _id: false
});

export const Locker = model<ILocker>('Locker', LockerSchema);