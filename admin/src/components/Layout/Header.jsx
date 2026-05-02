import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  LogOut,
  Menu,
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

  useEffect(() => {
    const init = async () => {
      if (!accessToken) await authRefreshToken();
      if (accessToken && !user) await authMe();
    };
    init();
  }, []);

  const handleLogOut = async () => {
    await authSignOut();
    navigate("/login");
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <div
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </div>

          <div className="hidden md:block">
            <p className="text-xl font-bold">Dashboard</p>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
        </div>

        {/* CENTER SEARCH */}

        <div className="flex items-center space-x-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/images/profile.png"
              className="w-8 h-8 rounded-full border"
            />
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      {open && (
        <div className="absolute right-4 mt-4 w-64 bg-white rounded-xl shadow-lg">
          <div className="p-4 border-b">
            <p className="font-semibold text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <DropdownItem icon={<User size={16} />} text="Profile" />
          <DropdownItem icon={<Settings size={16} />} text="Settings" />
          <DropdownItem icon={<HelpCircle size={16} />} text="Support" />

          <div className="border-t">
            <DropdownItem
              icon={<LogOut size={16} />}
              text="Logout"
              danger
              onClick={handleLogOut}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;


const Group = ({ title, children }) => (
  <div className="border-b last:border-none">
    <p className="px-3 pt-3 pb-1 text-xs text-gray-400 uppercase font-semibold">
      {title}
    </p>
    {children}
  </div>
);

const Item = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 mx-1 rounded-lg cursor-pointer hover:bg-gray-100"
  >
    {children}
  </div>
);

const DropdownItem = ({ icon, text, danger, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
      danger ? "text-red-500 hover:bg-red-50" : ""
    }`}
  >
    {icon}
    <span>{text}</span>
  </div>
);
