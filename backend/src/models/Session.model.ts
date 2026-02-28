import mongoose, { Schema, Document } from 'mongoose';
import { ISession } from '../types/poll.types';

export type SessionDocument = ISession & Document;

const SessionSchema = new Schema<SessionDocument>(
    {
        studentId: { type: String, required: true },
        studentName: { type: String, required: true },
        socketId: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

SessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24});

export const Session = mongoose.model<SessionDocument>("Session", SessionSchema);