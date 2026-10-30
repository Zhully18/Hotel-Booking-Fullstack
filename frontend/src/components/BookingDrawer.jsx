import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle2, AlertCircle, CreditCard, Clock } from "lucide-react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function BookingDrawer({ room, isOpen, onClose }) {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    city: "",
    preferredContact: "Email",
    checkInDate: "",
    checkOutDate: "",
    paymentMethod: "pay_on_arrival",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Auto-fill user email/name when drawer opens
  useEffect(() => {
    if (user) {
      const nameParts = (user.name || "").split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }
  }, [user, isOpen]);

  if (!isOpen || !room) return null;

  // Calculate nights & total price dynamically
  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return room.pricePerNight;
    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);
    if (start >= end) return room.pricePerNight;
    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return nights * room.pricePerNight;
  };

  const totalPrice = calculateTotal();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setSuccessMessage("");

  //   if (!user) {
  //     setError("Please log in to make a room reservation.");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const payload = {
  //       roomId: room._id,
  //       ...formData,
  //     };

  //     const response = await api.post("/api/bookings/create", payload);
      
  //     const serverMessage = response.data?.message || "Booking request received successfully!";
  //     setSuccessMessage(serverMessage);

  //   } catch (err) {
  //     console.error("Booking error:", err);
  //     setError(
  //       err.response?.data?.message || "Failed to process booking. Please try again."
  //     );
  //   } finally {
  //     setLoading(false); // This ensures the loading spinner/text always stops
  //   }
  // };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!user) {
      setError("Please log in to make a room reservation.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        roomId: room._id,
        ...formData,
      };

      const response = await api.post("/api/bookings/create", payload);
      
      const createdBooking = response.data.booking;
      const serverMessage = response.data?.message || "Booking request received successfully!";

      // If user selected Stripe, redirect them to the checkout page using the new booking ID
      if (formData.paymentMethod === "stripe" && createdBooking?._id) {
        navigate(`/checkout/${createdBooking._id}`);
      } else {
        // Otherwise, show the success message for pay_on_arrival
        setSuccessMessage(serverMessage);
      }

    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message || "Failed to process booking. Please try again."
      );
    } finally {
      setLoading(false); 
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Overlay Background */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Sliding Panel */}
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between transform transition duration-500 ease-in-out">
          
          {/* Panel Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Reservation Request
              </span>
              <h2 className="text-xl font-serif font-bold text-white mt-0.5">
                {room.roomType} (Room #{room.roomNumber})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Status Feedback Banners */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Booking Submitted Successfully
                </div>
                <p className="text-xs text-emerald-700">{successMessage}</p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold text-emerald-900 underline"
                >
                  Close window
                </button>
              </div>
            )}

            {!successMessage && (
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Personal Information */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Guest Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    >
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="WhatsApp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                {/* Dates Selection */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 pt-2">
                  Stay Schedule
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      name="checkInDate"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.checkInDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      name="checkOutDate"
                      required
                      min={formData.checkInDate || new Date().toISOString().split("T")[0]}
                      value={formData.checkOutDate}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 pt-2">
                  Payment Preference
                </h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-amber-600 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pay_on_arrival"
                      checked={formData.paymentMethod === "pay_on_arrival"}
                      onChange={handleChange}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" /> Pay on Arrival
                      </span>
                      <span className="text-xs text-slate-500">
                        Reservation will be set to PENDING until check-in payment.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-amber-600 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === "stripe"}
                      onChange={handleChange}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-amber-600" /> Pay Online (Stripe)
                      </span>
                      <span className="text-xs text-slate-500">
                        Secure instant online card payment.
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* Drawer Footer & Total Price Summary */}
          {!successMessage && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 font-medium">Calculated Total</span>
                <span className="text-2xl font-serif font-bold text-slate-900">
                  ${totalPrice}
                </span>
              </div>

              <button
                type="submit"
                form="booking-form"
                disabled={loading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-50"
              >
                {loading ? "Confirming Dates..." : "Complete Reservation"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}