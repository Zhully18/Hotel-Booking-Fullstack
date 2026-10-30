import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { CalendarCheck, AlertCircle, CheckCircle, Clock, XCircle, Search } from "lucide-react";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/bookings/admin/all");
      setBookings(response.data.bookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Handle status updates (e.g. Confirm, Cancel, Mark Paid)
  const handleStatusChange = async (id, newStatus, newPaymentStatus) => {
    try {
      setUpdatingId(id);
      const payload = {};
      if (newStatus) payload.status = newStatus;
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const response = await api.put(`/api/bookings/admin/update/${id}`, payload);
      
      // Update local state instantly
      setBookings(
        bookings.map((b) => (b._id === id ? response.data.booking : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter bookings by guest name or email
  const filteredBookings = bookings.filter(
    (b) =>
      b.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.room && b.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Manage Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review guest reservations, check-in dates, and manage approval statuses.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guest or room..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium">No bookings found</p>
            <p className="text-sm text-slate-400">Guest reservations will appear here once booked.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Guest</th>
                  <th className="py-4 px-6">Room</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Total / Payment</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/50 transition">
                    
                    {/* Guest Details */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-900 block">
                        {booking.firstName} {booking.lastName}
                      </span>
                      <span className="text-xs text-slate-400 block">{booking.email}</span>
                      <span className="text-xs text-slate-500">{booking.phone} ({booking.city})</span>
                    </td>

                    {/* Room Details */}
                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-800">
                        {booking.room ? booking.room.roomType : "Room Removed"}
                      </span>
                      <span className="text-xs text-amber-600 block">
                        #{booking.room ? booking.room.roomNumber : "N/A"}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 text-xs text-slate-600 space-y-0.5">
                      <div><strong className="text-slate-400">In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div><strong className="text-slate-400">Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                    </td>

                    {/* Pricing & Payment Method */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">${booking.totalPrice}</span>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                        {booking.paymentMethod.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-semibold ${
                          booking.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        Payment: {booking.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "Recieved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : booking.status === "Completed"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {booking.status === "Recieved" && <CheckCircle className="w-3.5 h-3.5" />}
                        {booking.status === "Completed" && <Clock className="w-3.5 h-3.5" />}
                        {booking.status === "Cancelled" && <XCircle className="w-3.5 h-3.5" />}
                        {booking.status}
                      </span>
                    </td>

                    {/* Actions Menu / Buttons */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <select
                        disabled={updatingId === booking._id}
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value, null)}
                        className="text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-600"
                      >
                        <option value="Recieved">Confirm</option>
                        <option value="Completed">Complete</option>
                        <option value="Cancelled">Cancel</option>
                      </select>

                      {booking.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => handleStatusChange(booking._id, null, "Paid")}
                          disabled={updatingId === booking._id}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}