import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Plus, Edit, Trash2, BedDouble, AlertCircle } from "lucide-react";

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch all rooms on load
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/rooms");
      setRooms(response.data.rooms);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle Delete Room
  const handleDelete = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room #${roomNumber}? This will also delete its images from Cloudinary.`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await api.delete(`/api/rooms/delete/${id}`);
      // Remove room from local state to update UI immediately
      setRooms(rooms.filter((room) => room._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete room");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Room CTA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Manage Rooms</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of all hotel rooms, pricing, and availability.
          </p>
        </div>
        <Link
          to="/admin/rooms/add"
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-sm shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Room
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Rooms Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <BedDouble className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium">No rooms found</p>
            <p className="text-sm text-slate-400">Get started by adding your first room.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Room</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Price / Night</th>
                  <th className="py-4 px-6">Capacity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-slate-50/50 transition">
                    {/* Room Preview & Number */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                        {room.roomImages && room.roomImages.length > 0 ? (
                          <img
                            src={room.roomImages[0].url}
                            alt={room.roomType}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BedDouble className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">#{room.roomNumber}</span>
                        <span className="text-xs text-slate-400">ID: {room._id.slice(-6)}</span>
                      </div>
                    </td>

                    {/* Room Type */}
                    <td className="py-4 px-6 font-medium text-slate-800">{room.roomType}</td>

                    {/* Price */}
                    <td className="py-4 px-6 font-semibold text-amber-600">${room.pricePerNight}</td>

                    {/* Capacity */}
                    <td className="py-4 px-6 text-slate-600">{room.capacity} Guests</td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          room.isAvailable
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {room.isAvailable ? "Available" : "Booked"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/admin/rooms/edit/${room._id}`}
                        className="inline-flex p-2 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-600 rounded-lg transition"
                        title="Edit Room"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(room._id, room.roomNumber)}
                        disabled={deleteLoading === room._id}
                        className="inline-flex p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-50"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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