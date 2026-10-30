import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, AlertCircle, BedDouble } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/bookings/my-bookings");
        setBookings(response.data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">My Reservations</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage all your past and upcoming stays with Lumina Hotel.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading & Empty States */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <BedDouble className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-slate-800">No Reservations Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven't booked any rooms yet. Explore our luxury suites and plan your next getaway.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-amber-600/20"
          >
            Explore Rooms
          </Link>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-6">
          {bookings.map((booking) => {
            const room = booking.room || {};
            const mainImage = room.roomImages && room.roomImages.length > 0 ? room.roomImages[0].url : null;

            return (
              <div
                key={booking._id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Room Image Preview */}
                <div className="md:col-span-3 h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  {mainImage ? (
                    <img src={mainImage} alt={room.roomType} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <BedDouble className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Booking Info */}
                <div className="md:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider uppercase text-amber-600">
                      Room #{room.roomNumber || "N/A"} • {room.roomType || "Suite"}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "Recieved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : booking.status === "Completed"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {booking.status === "Recieved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {booking.status === "Completed" && <Clock className="w-3.5 h-3.5" />}
                      {booking.status === "Cancelled" && <XCircle className="w-3.5 h-3.5" />}
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-slate-900">
                    {room.roomType || "Luxury Room"} Reservation
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                      <span><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    Booked for: <span className="font-medium text-slate-700">{booking.firstName} {booking.lastName}</span> ({booking.phone})
                  </div>
                </div>

                {/* Price & Payment Summary */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between h-full">
                  <div>
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400">Total Price</span>
                    <span className="text-2xl font-serif font-bold text-slate-900">${booking.totalPrice}</span>
                    <span className="block text-[11px] uppercase tracking-wider text-slate-500 mt-1">
                      Payment: <strong className="text-slate-800">{booking.paymentStatus}</strong> ({booking.paymentMethod.replace("_", " ")})
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className="inline-block w-full text-center py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
                      ID: {booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}