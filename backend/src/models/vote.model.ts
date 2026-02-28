import mongoose, { Schema, Document } from 'mongoose';
import { IVote } from '../types/poll.types';

export type VoteDocument = IVote & Document;

const VoteSchema = new Schema<VoteDocument>(
    {
        pollId: {type: Schema.Types.ObjectId, ref: 'Poll', required: true },
        optionId: { type: Schema.Types.ObjectId, required: true },
        studentId: { type: String, required: true },
        studentName: { type: String, required: true },
    },
    { timestamps: true }
);

VoteSchema.index({ pollId: 1, studentId: 1 }, { unique: true });

export const Vote = mongoose.model<VoteDocument>("Vote", VoteSchema);