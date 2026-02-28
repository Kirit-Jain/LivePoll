import { Server as SocketServer } from 'socket.io';

type TimeCallback = (pollId: string) => Promise<void>;

class TimeService {
    private timers: Map<string, NodeJS.Timeout> = new Map();
    private io: SocketServer | null = null;

    init(io: SocketServer)
    {
        this.io = io;
    }

    start (pollId: string, duration: number, onExpire: TimeCallback): void {
        this.clear(pollId); 
        
        const timeout = setTimeout(async() => {
            this.timers.delete(pollId);
            await onExpire(pollId);
        }, duration * 1000);
        this.timers.set(pollId, timeout);
        console.log(`Timer started for poll ${pollId} with duration ${duration} seconds.`);
    }

    clear(pollId: string): void {
        const existingTimer = this.timers.get(pollId);
        if (existingTimer) {
            clearTimeout(existingTimer);
            this.timers.delete(pollId);
        }
    }

    isRunning(pollId: string): boolean {
        return this.timers.has(pollId);
    }
}

export const timerService = new TimeService();