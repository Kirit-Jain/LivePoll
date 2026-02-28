import { Server as SocketServer, Socket } from "socket.io";
import { pollService } from "../services/poll.service";
import { voteService } from "../services/vote.service";
import { Session } from "../models/Session.model";

export const registerSocketHandlers = (io: SocketServer) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("STUDENT_JOIN", async ({ studentId, studentName }) => {
      await Session.findOneAndUpdate(
        { studentId },
        { studentId, studentName, socketId: socket.id, createdAt: new Date() },
        { upsert: true, new: true }
      );
      socket.join(`student:${studentId}`);
      console.log(`Student joined: ${studentName} (${studentId})`);
    });

    socket.on("TEACHER_JOIN", async () => {
      socket.join("teachers");
      console.log(`Teacher joined: ${socket.id}`);
      
      const state = await pollService.getSyncState("teacher");
      socket.emit("SYNC_STATE", state);

      const check = await pollService.canStartNewPoll();
      socket.emit("CAN_CREATE_POLL_RESULT", check);
    });

    socket.on("REQUEST_SYNC", async ({ studentId }: { studentId: string }) => {
      const state = await pollService.getSyncState(studentId);
      socket.emit("SYNC_STATE", state);
    });

    socket.on("CAN_CREATE_POLL", async () => {
      const result = await pollService.canStartNewPoll();
      socket.emit("CAN_CREATE_POLL_RESULT", result);
    });

    socket.on("START_POLL", async ({ pollId }: { pollId: string }) => {
      try {
        const poll = await pollService.startPoll(pollId);
        io.emit("POLL_STARTED", {
          poll,
          endsAt: poll.endsAt!.toISOString(),
        });
        
        const check = await pollService.canStartNewPoll();
        io.to("teachers").emit("CAN_CREATE_POLL_RESULT", check);
      } catch (err: any) {
        socket.emit("ERROR", { code: "START_FAILED", message: err.message });
      }
    });

    socket.on("VOTE_SUBMIT", async ({ pollId, optionId, studentId, studentName }) => {
      try {
        const updatedPoll = await voteService.submitVote(pollId, optionId, studentId, studentName);
        socket.emit("VOTE_ACK", { success: true });
        
        io.to("teachers").emit("VOTE_UPDATED", {
          pollId,
          options: updatedPoll?.options,
        });
        
        const check = await pollService.canStartNewPoll();
        io.to("teachers").emit("CAN_CREATE_POLL_RESULT", check);
      } catch (err: any) {
        socket.emit("VOTE_ACK", { success: false });
        socket.emit("ERROR", { code: err.message, message: err.message });
      }
    });

    socket.on("CLOSE_POLL", async ({ pollId }: { pollId: string }) => {
      try {
        await pollService.closePoll(pollId);
        
        const check = await pollService.canStartNewPoll();
        io.to("teachers").emit("CAN_CREATE_POLL_RESULT", check);
      } catch (err: any) {
        socket.emit("ERROR", { code: "CLOSE_FAILED", message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};