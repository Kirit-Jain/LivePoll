import { Request, Response, NextFunction } from 'express';
import { pollService } from '../services/poll.service';

export const pollController = {
    async createPoll(req: Request, res: Response, next: NextFunction) {
        try {
            const poll = await pollService.createPoll(req.body);
            res.status(201).json(poll);
        } catch (error) {
            next(error);
        }
    },

    async getActive (req: Request, res: Response, next: NextFunction) {
        try {
            const poll = await pollService.getActivePoll();
            res.json(poll ?? null);
        } catch (error) {
            next(error);
        }
    },

    async getHistory (req: Request, res: Response, next: NextFunction) {
        try {
            const polls = await pollService.getPollHistory();
            res.json(polls);
        } catch (error) {
            next(error);
        }
    },

    async closePoll (req: Request, res: Response, next: NextFunction) {
        try {
            const poll = await pollService.closePoll(req.params.id as string);
            res.json({ poll });
        } catch (error) {
            next(error);
        }
    },
};