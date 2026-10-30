import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect or trigger search query filtering
    navigate(`/?city=${city}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div className="relative bg-slate-900 text-white">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Hotel"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-28 sm:py-36 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight mb-6">
          Experience Unrivaled <span className="text-amber-500">Luxury</span> & Comfort
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 mb-12 font-light">
          Discover a sanctuary of elegance. Book exquisite rooms, enjoy world-class amenities, and create unforgettable memories.
        </p>

        {/* Floating Quick Search Widget */}
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-white text-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
        >
          <div className="text-left">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Location / Keyword</label>
            <input
              type="text"
              placeholder="e.g. Deluxe Suite"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Check-in / Check-out</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-end h-full pt-4 sm:pt-0">
            <button
              type="submit"
              className="w-full h-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>Check Availability</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}