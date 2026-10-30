import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  BedDouble,
  PlusCircle,
  CalendarCheck,
  Tag,
  LogOut,
  Building2,
} from "lucide-react";

export default function AdminSidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap ${
      isActive
        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
    }`;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shadow-2xl border-r border-slate-800 transition-all duration-300 ease-in-out z-40 ${
        isHovered ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3 overflow-hidden">
        <div className="bg-amber-600/20 p-2.5 rounded-xl border border-amber-600/30 text-amber-500 shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div
          className={`transition-opacity duration-300 overflow-hidden ${
            isHovered ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <h2 className="text-lg font-serif font-bold text-white tracking-wide whitespace-nowrap">
            Eden Hotel Admin
          </h2>
          <p className="text-[11px] text-slate-400 whitespace-nowrap">
            Management Panel
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-x-hidden">
        <NavLink to="/admin/dashboard" className={linkClass} title="Dashboard">
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Dashboard
          </span>
        </NavLink>
          
          <NavLink to="/admin/rooms/add" className={linkClass} title="Add Room">
          <PlusCircle className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Add Room
          </span>
        </NavLink>

        <NavLink to="/admin/rooms" className={linkClass} title="Manage Rooms">
          <BedDouble className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Manage Rooms
          </span>
        </NavLink>

        

        <NavLink to="/admin/bookings" className={linkClass} title="Manage Bookings">
          <CalendarCheck className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Manage Bookings
          </span>
        </NavLink>

        <NavLink to="/admin/discounts" className={linkClass} title="Holiday Discounts">
          <Tag className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Holiday Discounts
          </span>
        </NavLink>
      </nav>

      {/* Logout Action */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-full flex items-center gap-4 px-3 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all duration-300 font-medium group overflow-hidden"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span
            className={`transition-opacity duration-300 whitespace-nowrap ${
              isHovered ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}