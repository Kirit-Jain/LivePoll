import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPoll, IOption, PollStatus } from "@/types/poll.types";

interface PollState {
  currentPoll: IPoll | null;
  endsAt: string | null;
  hasVoted: boolean;
  isConnected: boolean;
  canCreatePoll: boolean;
  canCreateReason: string;
  votedCount: number;
  totalStudents: number;
}

const initialState: PollState = {
  currentPoll: null,
  endsAt: null,
  hasVoted: false,
  isConnected: false,
  canCreatePoll: true,
  canCreateReason: "",
  votedCount: 0,
  totalStudents: 0,
};

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setPoll(state, action: PayloadAction<IPoll>) {
      state.currentPoll = action.payload;
      state.hasVoted = false; // CRITICAL: Naya poll aate hi vote reset karo
    },
    setEndsAt(state, action: PayloadAction<string | null>) {
      state.endsAt = action.payload;
    },
    setHasVoted(state, action: PayloadAction<boolean>) {
      state.hasVoted = action.payload;
    },
    setStatus(state, action: PayloadAction<PollStatus>) {
      if (state.currentPoll) state.currentPoll.status = action.payload;
      if (action.payload === "active") state.hasVoted = false; // Extra safety
    },
    updateOptions(state, action: PayloadAction<IOption[]>) {
      if (state.currentPoll) state.currentPoll.options = action.payload;
    },
    clearPoll(state) {
      state.currentPoll = null;
      state.endsAt = null;
      state.hasVoted = false;
      state.canCreatePoll = true;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    setCanCreatePoll(state, action: PayloadAction<{ allowed: boolean; reason?: string; votedCount?: number; totalStudents?: number }>) {
      state.canCreatePoll = action.payload.allowed;
      state.canCreateReason = action.payload.reason ?? "";
      state.votedCount = action.payload.votedCount ?? 0;
      state.totalStudents = action.payload.totalStudents ?? 0;
    },
  },
});

export const { setPoll, setEndsAt, setHasVoted, setStatus, updateOptions, clearPoll, setConnected, setCanCreatePoll } = pollSlice.actions;
export default pollSlice.reducer;