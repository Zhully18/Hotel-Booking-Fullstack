import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      required: true,
    },
    // Guest Contact Details
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Please provide a city"],
      trim: true,
    },
    preferredContact: {
      type: String,
      enum: ["Email", "Phone", "WhatsApp"],
      default: "Email",
    },
    // Schedule Dates & Times
    checkInDate: {
      type: Date,
      required: [true, "Please provide a check-in date"],
    },
    checkOutDate: {
      type: Date,
      required: [true, "Please provide a check-out date"],
    },
    checkInTime: {
      type: String, // e.g., "14:00"
      default: "14:00",
    },
    checkOutTime: {
      type: String, // e.g., "11:00"
      default: "11:00",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "pay_on_arrival"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Unpaid", "Paid", "Failed"],
      default: "Pending",
    },
    stripePaymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Recieved", "Cancelled", "Completed"],
      default: "Recieved",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;