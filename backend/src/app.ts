import express, { Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import pollRoutes from './routes/poll.routes';
import { errorhandler } from './middleware/error.middleware';

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (req: Request, res: Response) => res.json({ status: 'ok' }));
app.use("/api/polls", pollRoutes);

app.use(errorhandler);

export default app;