import mongoose, { Document, Schema } from 'mongoose';
import { IPoll, IOption } from '../types/poll.types';

export type PollDocument = IPoll & Document;

const OptionSchema = new Schema<IOption>({
    text: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0, min: 0 },
});

const PollSchema = new Schema<PollDocument>(
    {
        question: {type: String, requried: true, trim: true},
        options: {
            type: [OptionSchema],
            required: true,
            validate: {
                validator: (v: IOption[]) => v.length >= 2,
                message: 'A poll must have at least 2 options.',
            },
        },
        status: { type: String, enum: ["pending", "active", "closed"], default: "pending" },
        duration: { type: Number, required: true, min: 5 },
        startedAt: {type: Date, default: null },
        endsAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// This is for searching the active polls
PollSchema.index({ status: 1 });
// Poll history ordered by newest first
PollSchema.index({ createdAt: -1 });

export const Poll = mongoose.model<PollDocument>("Poll", PollSchema);