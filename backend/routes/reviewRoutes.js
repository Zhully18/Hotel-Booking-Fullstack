import express from "express";
import {
  addReview,
  getRoomReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const reviewRouter = express.Router();

// Public: Get reviews for a room
reviewRouter.get("/:roomId", getRoomReviews);

// Private: Add a review for a room
reviewRouter.post("/:roomId", protect, addReview);

// Private/Admin: Delete a review
reviewRouter.delete("/:id", protect, deleteReview);

export default reviewRouter;