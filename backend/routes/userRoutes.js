import express from "express";
import {
  registerUser,
  loginUser,
  loginAdmin,
  forgotPassword,
} from "../controllers/userController.js";

const userRouter= express.Router();

// User Auth Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/forgotpassword", forgotPassword);

// Admin Auth Route
userRouter.post("/admin/login", loginAdmin);

export default userRouter;