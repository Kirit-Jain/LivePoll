import { Poll } from '../models/poll.model';
import { Vote } from '../models/vote.model';
import { Types } from 'mongoose';

export const voteService = {
    async submitVote(pollId: string, optionId: string, studentId: string, studentName: string) {
        // First we will validate if teh poll is still active or not.
        const poll = await Poll.findById(pollId);
        if (!poll) throw new Error('Poll not found');
        if (poll.status !== 'active') throw new Error('Poll is not active');
        if (poll.endsAt && poll.endsAt < new Date()) throw new Error('Poll has already ended');

        // if the option is valid or not in this poll
        const option = poll.options.find(opt => opt._id?.toString() === optionId);
        if (!option) throw new Error('Option not found');

        // Now we will make sure that the student has not already voted for the poll
        try {
            await Vote.create({ pollId, optionId, studentId, studentName });
        } catch (error : any) {
            if (error.code === 11000) throw new Error ('You have already voted in this poll');
            throw error;
        }

        // if everything is fine, we will increment the vote count for the option
        await Poll.updateOne(
            { _id: pollId, 'options._id': optionId },
            { $inc: { 'options.$.votes': 1 } }
        )

        // we will now emit the updated poll results to all the clients
        const updatedPoll = await Poll.findById(pollId).lean();
        return updatedPoll;
    },
};