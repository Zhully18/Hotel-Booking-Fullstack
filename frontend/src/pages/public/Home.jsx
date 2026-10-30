import React, { useState, useEffect } from "react";
import HeroSection from "../../components/HeroSection";
import RoomCard from "../../components/RoomCard";
import BookingDrawer from "../../components/BookingDrawer";
import api from "../../services/api";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/rooms");
        setRooms(response.data.rooms);
      } catch (err) {
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);
  
  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setIsDrawerOpen(true);
  };

  // Fetch all rooms from the backend
  useEffect(() => {
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

    fetchRooms();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION AT THE TOP */}
      <HeroSection />

      {/* 2. ROOM LISTINGS SECTION */}
      <section id="rooms" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
  <div className="text-center mb-16">
    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
      Our Luxurious Rooms & Suites
    </h2>
    <p className="text-slate-600 mt-2">
      Handcrafted for ultimate comfort and tranquility
    </p>
  </div>

  {loading ? (
    <div className="text-center py-12 text-slate-500 font-medium">
      Loading available rooms...
    </div>
  ) : error ? (
    <div className="text-center py-12 text-red-500 font-medium">
      {error}
    </div>
  ) : rooms.length === 0 ? (
    <div className="text-center py-12 text-slate-500">
      No rooms available at the moment.
    </div>
  ) : (
    <div className="space-y-8">
      {rooms.map((room) => (
        <RoomCard 
          key={room._id} 
          room={room} 
          onBookNow={handleOpenBooking}
        />
      ))}
    </div>
  )}
</section>

{/* Sliding Drawer */}
      <BookingDrawer
        room={selectedRoom}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}