import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

// Context Provider
import { AuthProvider } from "./context/AuthContext";

// Route Protections
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Layouts & Global Components
import AdminLayout from "./layout/AdminLayout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import Home from "./pages/public/Home";
import RoomDetails from "./pages/public/RoomDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import AdminLogin from "./pages/public/AdminLogin";

// User Pages
import MyBookings from "./pages/user/MyBookings";
import StripeCheckout from "./pages/user/StripeCheckout";
// import Profile from "./pages/user/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import AddRoom from "./pages/admin/AddRoom";
import EditRoom from "./pages/admin/EditRoom";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageDiscounts from "./pages/admin/ManageDiscounts";

// Layout wrapper for Public & User pages so Navbar and Footer show automatically
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ================= PUBLIC & USER PAGES (With Navbar & Footer) ================= */}
          <Route element={<PublicLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected User Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout/:bookingId"
              element={
                <ProtectedRoute>
                  <StripeCheckout />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            /> */}
          </Route>

          {/* ================= ADMIN PAGES (With Sidebar Layout, NO Public Navbar/Footer) ================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="rooms/add" element={<AddRoom />} />
            <Route path="rooms/edit/:id" element={<EditRoom />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="discounts" element={<ManageDiscounts />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route
            path="*"
            element={
              <div className="flex h-screen items-center justify-center text-xl font-bold">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}