import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import {
  setPoll,
  setEndsAt,
  setHasVoted,
  setStatus,
  updateOptions,
  clearPoll,
  setConnected,
  setCanCreatePoll,
} from "@/store/slices/pollslices";
import type {
  SyncStatePayload,
  PollStartedPayload,
  VoteUpdatedPayload,
  PollClosedPayload,
} from "@/types/poll.types";

export const usePollState = (socket: Socket, role: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const onConnect = () => {
      dispatch(setConnected(true));
      if (role === "teacher") {
        socket.emit("TEACHER_JOIN");
        socket.emit("CAN_CREATE_POLL");
      } else {
        socket.emit("STUDENT_JOIN", {
          studentId: role,
        });
      }
      socket.emit("REQUEST_SYNC", { studentId: role });
    };

    const onDisconnect = () => dispatch(setConnected(false));

    socket.on("connect",    onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) onConnect();

    const onSyncState = (payload: SyncStatePayload) => {
      if (payload.poll) {
        dispatch(setPoll(payload.poll));
        dispatch(setEndsAt(payload.endsAt));
        dispatch(setHasVoted(payload.hasVoted));
      } else {
        dispatch(clearPoll());
      }
    };

    const onPollStarted = ({ poll, endsAt }: PollStartedPayload) => {
      dispatch(setPoll(poll));
      dispatch(setEndsAt(endsAt));
      dispatch(setHasVoted(false));
      dispatch(setStatus("active"));
      dispatch(setCanCreatePoll({ allowed: false, reason: "POLL_ALREADY_ACTIVE" }));
    };

    const onVoteUpdated = ({ options }: VoteUpdatedPayload) => {
      dispatch(updateOptions(options));
    };

    const onPollClosed = (payload: PollClosedPayload) => {
      dispatch(setStatus("closed"));
      dispatch(setEndsAt(null));
      if (payload.tally && payload.tally.length > 0) {
        dispatch(updateOptions(payload.tally));
      }
    };

    const onCanCreate = (result: { allowed: boolean; reason?: string; votedCount?: number; totalStudents?: number }) => {
      dispatch(setCanCreatePoll(result));
    };

    socket.on("SYNC_STATE",              onSyncState);
    socket.on("POLL_STARTED",            onPollStarted);
    socket.on("VOTE_UPDATED",            onVoteUpdated);
    socket.on("POLL_CLOSED",             onPollClosed);
    socket.on("CAN_CREATE_POLL_RESULT",  onCanCreate);

    
    return () => {
      socket.off("connect",               onConnect);
      socket.off("disconnect",            onDisconnect);
      socket.off("SYNC_STATE",            onSyncState);
      socket.off("POLL_STARTED",          onPollStarted);
      socket.off("VOTE_UPDATED",          onVoteUpdated);
      socket.off("POLL_CLOSED",           onPollClosed);
      socket.off("CAN_CREATE_POLL_RESULT", onCanCreate);
    };
  }, [socket, role, dispatch]);
};