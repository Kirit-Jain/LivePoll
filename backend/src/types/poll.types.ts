import { Types } from 'mongoose';

// Poll Types
export type PollStatus = "pending" | "active" | "closed";

export interface IOption {
    _id: Types.ObjectId;
    text: string;
    votes: number;
}

export interface IPoll {
    _id: Types.ObjectId;
    question: string;
    options: IOption[];
    status: PollStatus;
    duration: number;
    startedAt: Date | null;
    endsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVote {
    _id: Types.ObjectId;
    pollId: Types.ObjectId;
    optionId: Types.ObjectId;
    studentId: string;
    studentName: string;
    createdAt: Date;
}

export interface ISession {
    studentId: string;
    studentName: string;
    socketId: string;
    createdAt: Date;
}

// DTOs
export interface CreatePollDto {
  question: string;
  options: string[];
  duration: number;
}

export interface SyncStatePayload {
  poll: IPoll | null;
  endsAt: string | null;
  hasVoted: boolean;
}