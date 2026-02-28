import { Router } from "express";
import { pollController } from "../controllers/poll.controller";

const router = Router();

// Create a new poll
router.post("/", pollController.createPoll);

// Get the active poll
router.get("/active", pollController.getActive);

// Get poll history
router.get("/history", pollController.getHistory);

// Close a poll
router.patch("/:id/delete", pollController.closePoll);

export default router;