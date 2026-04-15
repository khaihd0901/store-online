import React, { useState } from "react";
import { ChevronDown, LayoutDashboard, Store } from "lucide-react";
import menuItems from "../../libs/menuItems.js";
import { Link } from "react-router";
const Sidebar = ({ collapsed, currentPage, onPageChange }) => {
  const [expandedItems, setExpandedItems] = useState(new Set(["catalog"]));

  const toggleHandle = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };
  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out bg-white/80  backdrop-blur-xl border-r border-gray-200  flex flex-col relative z-10`}
    >
      {/*Logo*/}
      <div className="py-6 px-6 border-b border-gray-200 transition-all duration-200 ">
        <div className="flex items-center space-x-3 ">
          <Link
            to="/admin"
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-fdaa3d)] cursor-pointer shadow-lg`}
          >
            <Store className={`w-5 h-5 text-white`} />
          </Link>
          {!collapsed && (
            <div className="">
              <p className="text-xl font-bold text-gray-800">Bookly</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/*Navigation*/}
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        <Link to={'/admin'}
        onClick={() => onPageChange("admin")}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 bg-[var(--color-febd69)] text-white shadow-lg shadow-gray-500/25}`}
        >
          <LayoutDashboard />
          {
            !collapsed && <span className="font-medium ml-2">Dashboard</span>
          }
        </Link>
        {menuItems.map((item) => (
          <div key={item.id} className="cursor-pointer">
            <div
              onClick={() => {
                if (item.submenu) {
                  toggleHandle(item.id);
                } else {
                  onPageChange(item.id);
                }
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                currentPage === item.id || item.active
                  ? "bg-[var(--color-febd69)] text-white shadow-lg shadow-gray-500/25"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5`} />
                {!collapsed && (
                  <>
                    <span className="font-medium ml-2">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.count && (
                      <span className="px-2 py-1 text-xs bg-gray-600 text-white rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </div>
              {!collapsed && item.submenu && (
                <ChevronDown className="w-4 h-4 transition-transform" />
              )}
            </div>

            {/* Sub Menu */}
            {!collapsed && item.submenu && expandedItems.has(item.id) && (
              <div className="ml-8 mt-2 space-y-1">
                {item.submenu.map((subitem) => (
                  <Link
                    to={`${subitem.id}`}
                    onClick={() => onPageChange(subitem.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      currentPage === subitem.id
                        ? "bg-[var(--color-febd69)] text-white shadow-lg shadow-gray-500/25"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    key={subitem.id}
                  >
                    {subitem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      {/* User Profile */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100">
            <img
              src="https://i.pinimg.com/originals/2e/ab/0c/2eab0c649996a4d200556cdefdcc8b92.png"
              alt="user"
              className="w-10 h-10 rounded-full ring-2 ring-[var(--color-fdaa3d)]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  Quang Khai
                </p>
                <p className="text-xs text-gray-500 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
