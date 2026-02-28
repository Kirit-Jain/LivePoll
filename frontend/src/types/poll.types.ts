export type PollStatus = "pending" | "active" | "closed";

export interface IOption {
  _id: string;
  text: string;
  votes: number;
}

export interface IPoll {
  _id: string;
  question: string;
  options: IOption[];
  status: PollStatus;
  duration: number;
  startedAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
}


// Socket event payload types

export interface SyncStatePayload {
  poll: IPoll | null;
  endsAt: string | null;
  hasVoted: boolean;
}

export interface PollStartedPayload {
  poll: IPoll;
  endsAt: string;
}

export interface VoteUpdatedPayload {
  pollId: string;
  options: IOption[];
}

export interface PollClosedPayload {
  pollId: string;
  tally: IOption[];
}

export interface VoteAckPayload {
  success: boolean;
}

export interface SocketError {
  code: string;
  message: string;
}

// UI

export type UserRole = "teacher" | "student";

export interface StudentIdentity {
  studentId: string;
  studentName: string;
}