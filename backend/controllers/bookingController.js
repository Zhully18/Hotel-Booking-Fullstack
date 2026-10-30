import Booking from "../models/bookingModel.js";
import Room from "../models/roomModel.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Authenticated User)
export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      firstName,
      lastName,
      email,
      phone,
      city,
      preferredContact,
      checkInDate,
      checkOutDate,
      paymentMethod,

    } = req.body;

    // 1. Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // 2. Overlap Check: Find existing active bookings for this room that collide with dates
    const overlappingBooking = await Booking.findOne({
      room: roomId,
      status: { $ne: "Cancelled" },
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: "This room is already reserved for the selected dates. Please choose another date range.",
      });
    }

    // 3. Calculate total price based on number of nights
    const diffTime = Math.abs(end - start);
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = totalNights * room.pricePerNight;

    // 4. Create Booking Document
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      firstName,
      lastName,
      email,
      phone,
      city,
      preferredContact,
      checkInDate,
      checkOutDate,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "pay_on_arrival" ? "Pending" : "Unpaid",
      status: "Recieved",
    });

    return res.status(201).json({
      success: true,
      booking,
      message:
        paymentMethod === "pay_on_arrival"
          ? "Your reservation is pending confirmation upon arrival."
          : "Redirecting to payment...",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "room",
      "roomType roomNumber pricePerNight roomImages"
    );
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("room", "roomType roomNumber pricePerNight roomImages amenities");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Ensure regular users can only view their own bookings, admins can view any
    if (
      req.user.role !== "admin" &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllBookingsAdmin = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("room", "roomNumber roomType pricePerNight")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Confirm, Cancel, Complete, Payment Status)
// @route   PUT /api/bookings/admin/update/:id
// @access  Private/Admin
export const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("room", "roomNumber roomType pricePerNight")
      .populate("user", "name email");

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const getAllBookingsAdmin = async (req, res) => {
//   try {
//     const bookings = await Booking.find({})
//       .populate("user", "name email")
//       .populate("room", "roomType roomNumber");

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       bookings,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { bookingStatus, paymentStatus } = req.body;
//     let booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     if (bookingStatus) booking.bookingStatus = bookingStatus;
//     if (paymentStatus) booking.paymentStatus = paymentStatus;

//     await booking.save();

//     res.status(200).json({
//       success: true,
//       message: "Booking updated successfully",
//       booking,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };