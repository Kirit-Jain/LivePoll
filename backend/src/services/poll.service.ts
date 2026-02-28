import { Poll } from "../models/poll.model";
import { Vote } from "../models/vote.model";
import { Session } from "../models/Session.model";
import { timerService } from "./timer.service";
import { CreatePollDto, SyncStatePayload } from "../types/poll.types";
import { Server as SocketServer } from "socket.io";

let io: SocketServer;

export const pollService = {
  init(socketServer: SocketServer) {
    io = socketServer;
  },

  async createPoll(dto: CreatePollDto) {
    const activePoll = await Poll.findOne({ status: "active" });
    if (activePoll) throw new Error("POLL_ALREADY_ACTIVE");

    const check = await pollService.canStartNewPoll();
    if (!check.allowed) throw new Error(check.reason ?? "NOT_ALLOWED");

    const poll = new Poll({
      question: dto.question,
      options: dto.options.map((opt: any) => ({ 
        text: typeof opt === 'string' ? opt : opt.text 
      })),
      duration: dto.duration,
    });
    return poll.save();
  },

  async canStartNewPoll(): Promise<{ allowed: boolean; reason?: string; votedCount?: number; totalStudents?: number }> {
    const activePoll = await Poll.findOne({ status: "active" });
    
    if (activePoll) {
      const totalStudents = await Session.countDocuments();
      const votedCount = await Vote.countDocuments({ pollId: activePoll._id });
      return { 
        allowed: false, 
        reason: "POLL_ALREADY_ACTIVE", 
        votedCount, 
        totalStudents 
      };
    }

    return { allowed: true };
  },

  async startPoll(pollId: string) {
    const poll = await Poll.findById(pollId);
    if (!poll) throw new Error("Poll not found");
    if (poll.status !== "pending") throw new Error("Poll is not in pending state");

    const now = new Date();
    poll.status = "active";
    poll.startedAt = now;
    poll.endsAt = new Date(now.getTime() + poll.duration * 1000);
    await poll.save();

    const msRemaining = poll.endsAt.getTime() - Date.now();
    timerService.start(pollId, msRemaining, async () => {
      await pollService.closePoll(pollId);
    });

    return poll;
  },

  async closePoll(pollId: string) {
    const poll = await Poll.findByIdAndUpdate(
      pollId,
      { status: "closed" },
      { new: true }
    );
    if (!poll) return;

    timerService.clear(pollId);

    const tally = await pollService.getTally(pollId);
    io.emit("POLL_CLOSED", { pollId, finalResults: tally });
    console.log(`🔒 Poll ${pollId} closed`);
  },

  async getTally(pollId: string) {
    const poll = await Poll.findById(pollId).lean();
    if (!poll) return [];
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
    return poll.options.map((o) => ({
      _id: o._id,
      text: o.text,
      votes: o.votes,
      percentage: totalVotes > 0 ? Math.round((o.votes / totalVotes) * 100) : 0,
    }));
  },

  async getActivePoll() {
    return Poll.findOne({ status: "active" }).lean();
  },

  async getPollHistory(limit = 20) {
    return Poll.find({ status: "closed" }).sort({ createdAt: -1 }).limit(limit).lean();
  },

  async getSyncState(studentId: string): Promise<SyncStatePayload> {
    const poll = await Poll.findOne({ status: "active" }).lean();
    if (!poll) return { poll: null, endsAt: null, hasVoted: false };

    const hasVoted = !!(await Vote.exists({ pollId: poll._id, studentId }));
    return {
      poll: poll as any,
      endsAt: poll.endsAt!.toISOString(),
      hasVoted,
    };
  },

  async restoreTimers() {
    const activePoll = await Poll.findOne({ status: "active" });
    if (!activePoll || !activePoll.endsAt) return;

    const msRemaining = activePoll.endsAt.getTime() - Date.now();
    if (msRemaining <= 0) {
      await pollService.closePoll((activePoll._id as any).toString());
    } else {
      timerService.start(
        (activePoll._id as any).toString(),
        msRemaining,
        async () => {
          await pollService.closePoll((activePoll._id as any).toString());
        }
      );
      console.log(`♻️ Restored timer for poll ${activePoll._id} — ${msRemaining}ms remaining`);
    }
  },
};