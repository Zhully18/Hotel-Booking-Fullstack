import Review from "../models/reviewModel.js";
import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

// @desc    Add a review for a room (User must have a completed booking)
// @route   POST /api/reviews/:roomId
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const roomId = req.params.roomId;

    // 1. Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // 2. Verify if the user has a completed booking for this room
    const hasStayed = await Booking.findOne({
      user: req.user._id,
      room: roomId,
      bookingStatus: "Completed", // Can also allow "Confirmed" depending on your workflow
    });

    if (!hasStayed && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only review rooms you have stayed in",
      });
    }

    // 3. Check if user already reviewed this room
    const existingReview = await Review.findOne({
      user: req.user._id,
      room: roomId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this room. You can edit your review instead.",
      });
    }

    // 4. Create review
    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews for a specific room
// @route   GET /api/reviews/:roomId
// @access  Public
export const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ room: req.params.roomId }).populate(
      "user",
      "name avatar"
    );

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: averageRating.toFixed(1),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review (User who wrote it or Admin)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // Check ownership or admin role
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};