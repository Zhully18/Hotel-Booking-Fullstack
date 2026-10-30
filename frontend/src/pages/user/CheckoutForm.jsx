import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../../services/api";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";

export default function CheckoutForm({ bookingId, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await api.post("/api/payments/create-intent", { bookingId });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to initialize secure payment.");
      }
    };
    if (bookingId) fetchPaymentIntent();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setError("");

    const cardElement = elements.getElement(CardElement);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await api.post("/api/payments/verify", {
          paymentIntentId: paymentIntent.id,
          bookingId,
        });
      } catch (err) {
        console.error("Verification sync warning:", err);
      }

      window.location.href = "/my-bookings";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Card Information
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1e293b",
                "::placeholder": { color: "#94a3b8" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Payments are securely encrypted and processed via Stripe.</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-md shadow-amber-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Lock className="w-4 h-4" />
        {loading ? "Processing Secure Payment..." : `Pay $${totalPrice}`}
      </button>
    </form>
  );
}