import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const bookingRouter = express.Router();


bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/my-bookings", protect, getMyBookings);
bookingRouter.get("/:id", protect, getBookingById);

// Admin Routes
bookingRouter.get("/admin/all", protect, adminOnly, getAllBookingsAdmin);
bookingRouter.put("/admin/update/:id", protect, adminOnly, updateBookingStatusAdmin);

export default bookingRouter;