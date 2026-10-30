import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import api from "../../services/api";
import CheckoutForm from "../user/CheckoutForm";
import { ArrowLeft } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckout() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/api/bookings/my-bookings`);
        const found = response.data.bookings.find((b) => b._id === bookingId);
        setBooking(found);
      } catch (err) {
        console.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return <div className="text-center py-24 text-slate-500 font-medium">Loading checkout portal...</div>;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => (window.location.href = "/my-bookings")}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-serif font-bold text-slate-900">Secure Checkout</h2>
          <div className="w-8" />
        </div>

        {booking && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-1 text-amber-900">
            <div className="flex justify-between font-semibold">
              <span>Total Amount Due:</span>
              <span className="text-amber-700 text-sm font-bold">${booking.totalPrice}</span>
            </div>
            <div className="text-slate-500">
              Booking ID: #{booking._id.slice(-6).toUpperCase()}
            </div>
          </div>
        )}

        <Elements stripe={stripePromise}>
          <CheckoutForm bookingId={bookingId} totalPrice={booking?.totalPrice || 0} />
        </Elements>

      </div>
    </div>
  );
}