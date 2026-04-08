import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { accessToken, user, authRefreshToken, authMe, authSignOut } =
    useAuthStore();
  const init = async () => {
    if (!accessToken) {
      await authRefreshToken();
    }
    if (accessToken && !user) {
      await authMe();
    }
  };

  useEffect(() => {
    init();
  }, []);
  const handleLogOut = async () => {
    try {
      await authSignOut();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* Left Section  */}
        <div className="flex items-center space-x-4">
          <div
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-xl font-black text-gray-800">Dashboard</p>
            <p className="text-sm">
              Welcome back, Admin here's what's happening today
            </p>
          </div>
        </div>
        {/* Center */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search here"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
            />
          </div>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Quic Action */}
          <div
            className="cursor-pointer hidden lg:flex items-center space-x-2 py-2 px-4
            bg-[var(--color-fdaa3d)] text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs font-medium">New</span>
          </div>

          {/* Notification */}
          <div className="cursor-pointer relative p-2 5 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 right-1 w-5 h05 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              3
            </span>
          </div>

          {/* Setting */}
          <div className="p-2 5 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
            <Settings className="w-5 h-5" />
          </div>

          {/* User Profile */}
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-3 pl-3 border-l border-gray-200 cursor-pointer"
          >
            <img
              src={`../../../public/images/profile.png`}
              alt="user"
              className="2-8 h-8 rounded-full border border-[var(--color-fdaa3d)]"
            />
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-1 mt-4 w-64 bg-white rounded-xl shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3">
            <p className="font-semibold text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu */}
          <div className="py-2">
            <DropdownItem icon={<User size={16} />} text="Edit profile" />
            <DropdownItem
              icon={<Settings size={16} />}
              text="Account settings"
            />
            <DropdownItem icon={<HelpCircle size={16} />} text="Support" />
          </div>

          {/* Footer */}
          <div onClick={handleLogOut} className="border-t border-gray-300 py-2">
            <DropdownItem icon={<LogOut size={16} />} text="Sign out" danger />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
const DropdownItem = ({ icon, text, danger }) => {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer
        hover:bg-gray-100 transition
        ${danger ? "text-red-500 hover:bg-red-50" : ""}`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};
