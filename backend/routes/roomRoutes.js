import express from "express";
import {
  addRoom,
  editRoom,
  deleteRoom,
  listAllRooms,
  listSpecificRoomById,
  manageDiscounts,
} from "../controllers/roomController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const roomRouter = express.Router();

// Public Routes
roomRouter.get("/", listAllRooms);
roomRouter.get("/:id", listSpecificRoomById);

// Admin Protected Routes (with Multer middleware for up to, say, 5 images)
roomRouter.post("/add", protect, adminOnly, upload.array("images", 5), addRoom);
roomRouter.put("/edit/:id", protect, adminOnly, upload.array("images", 5), editRoom);
roomRouter.delete("/delete/:id", protect, adminOnly, deleteRoom);
roomRouter.post("/discounts", protect, adminOnly, manageDiscounts); // or manageDiscounts

export default roomRouter;