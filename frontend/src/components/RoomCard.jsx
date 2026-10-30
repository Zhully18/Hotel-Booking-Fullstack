import React, { useState } from "react";
import { Users, BedDouble, Check, Sparkles } from "lucide-react";

export default function RoomCard({ room, onBookNow }) {
  // Use the first image as the main display, or fall back to a placeholder
  const images = room.roomImages || [];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const mainImage = images.length > 0 ? images[activeImageIndex].url : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition duration-300 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Stunning Photo Showcase (Spans 7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative h-[320px] sm:h-[400px] rounded-2xl overflow-hidden shadow-md bg-slate-200">
            <img
              src={mainImage}
              alt={room.roomType}
              className="w-full h-full object-cover transition duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 tracking-wider uppercase shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Room #{room.roomNumber}
            </div>
          </div>

          {/* Thumbnail Preview Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? "border-amber-600 scale-[1.02]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Room Information & Action (Spans 5 columns) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
          <div>
            {/* Top metadata tags */}
            <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-slate-500 uppercase mb-2">
              <span>{room.roomType}</span>
              <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {room.isAvailable ? "Available" : "Booked"}
              </span>
            </div>

            {/* Room Title */}
            <h3 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-3">
              {room.roomType}
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {room.description || "Experience supreme luxury, elegant interiors, and world-class amenities designed for your absolute peace and relaxation."}
            </p>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#E8E2D9] text-sm">
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">Capacity</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Users className="w-4 h-4 text-amber-600" /> Up to {room.capacity}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">Identifier</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <BedDouble className="w-4 h-4 text-amber-600" /> #{room.roomNumber}
                </span>
              </div>
              <div>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-medium">Setting</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">Private</span>
              </div>
            </div>

            {/* Amenities Highlights */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 text-xs text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <Check className="w-3 h-3 text-amber-600" /> {amenity}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Booking Trigger */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif font-bold text-slate-900">
                  ${room.pricePerNight}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ night</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Includes taxes, resort access, and complimentary breakfast.
              </p>
            </div>

            <button
              onClick={() => onBookNow(room)}
              className="w-full py-4 bg-[#A38658] hover:bg-[#8D7249] text-white font-medium tracking-wide text-sm rounded-xl transition duration-300 shadow-md flex items-center justify-center gap-2"
            >
              RESERVE THE {room.roomType.toUpperCase()}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}