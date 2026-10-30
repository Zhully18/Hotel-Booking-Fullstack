import Room from "../models/roomModel.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Add a new room with images (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
export const addRoom = async (req, res) => {
  try {
    const { roomType, roomNumber, pricePerNight, capacity, amenities, description } = req.body;

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return res.status(400).json({ success: false, message: "Room number already exists" });
    }

    let roomImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        roomImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const room = await Room.create({
      roomType,
      roomNumber,
      pricePerNight,
      capacity,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : JSON.parse(amenities)) : [],
      description,
      roomImages,
    });

    res.status(201).json({ success: true, message: "Room added successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit/Update room details and replace images on Cloudinary (Admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const editRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    let updatedImages = room.roomImages;

    // If new images are uploaded, delete old ones from Cloudinary and upload new ones
    if (req.files && req.files.length > 0) {
      // 1. Delete old images from Cloudinary
      for (const img of room.roomImages) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // 2. Upload new images
      updatedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        updatedImages.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    const updateData = {
      ...req.body,
      roomImages: updatedImages,
      amenities: req.body.amenities 
        ? (Array.isArray(req.body.amenities) ? req.body.amenities : JSON.parse(req.body.amenities)) 
        : room.amenities,
    };

    room = await Room.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete room and remove its images from Cloudinary (Admin only)
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    for (const img of room.roomImages) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await room.deleteOne();
    res.status(200).json({ success: true, message: "Room and its images deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    List all rooms (Public)
// @route   GET /api/rooms
// @access  Public
export const listAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List specific room by ID (Public)
// @route   GET /api/rooms/:id
// @access  Public
export const listSpecificRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Manage holiday discounts (Admin only)
// @route   POST /api/rooms/discounts
// @access  Private/Admin
export const manageDiscounts = async (req, res) => {
  try {
    const { holidayName, discountPercentage, startDate, endDate } = req.body;

    const discount = await Discount.create({
      holidayName,
      discountPercentage,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Holiday discount created successfully",
      discount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};