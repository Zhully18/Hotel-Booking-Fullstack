import stripe from "../utils/stripe.js";
import Booking from "../models/bookingModel.js";

// @desc    Create Stripe Payment Intent for a booking
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1. Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // 2. Ensure user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized for this payment" });
    }

    // 3. Create a PaymentIntent with the booking's total price (converted to cents for Stripe)
    const amountInCents = Math.round(booking.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Change to your preferred currency (e.g., 'eur', 'ngn')
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    // 4. Optionally save the intent ID to the booking
    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};