import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: [true, "Please add a room type (e.g., Deluxe, Suite, Single)"],
    },
    roomNumber: {
      type: String,
      required: [true, "Please add a room number or identifier"],
      unique: true,
    },
    pricePerNight: {
      type: Number,
      required: [true, "Please add a price per night"],
    },
    capacity: {
      type: Number,
      required: [true, "Please specify room capacity (number of guests)"],
    },
    amenities: [String], // e.g., ["AC", "Free WiFi", "Smart TV"]
    description: {
      type: String,
      required: [true, "Please add a room description"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    roomImages: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;