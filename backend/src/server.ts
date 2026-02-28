import http from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { registerSocketHandlers } from './sockets';
import { pollService } from './services/poll.service';
import { timerService } from './services/timer.service';``

const httpServer = http.createServer(app);

const io = new SocketServer(httpServer, {
    cors: { origin: ENV.CORS_ORIGIN, methods: ["GET", "POST", "PATCH"] },
});

// Wiring up the dependencies
timerService.init(io);
pollService.init(io);
registerSocketHandlers(io);

const start = async () => {
    await connectDB();
    await pollService.restoreTimers();

    httpServer.listen(ENV.PORT, () => {
        console.log(`Server is running on http://localhost:${ENV.PORT}`);
    });
};

start().catch(console.error);