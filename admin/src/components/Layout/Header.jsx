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
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");

  const { accessToken, user, authRefreshToken, authMe, authSignOut } =
    useAuthStore();

  const { userSearchGlobal, results } = useUserStore();
  const getType = () => {
    if (location.pathname.includes("/admin/products")) return "product";
    if (location.pathname.includes("/admin/categories")) return "category";
    if (location.pathname.includes("/admin/all-users")) return "user";

    if (location.pathname.includes("/admin/order-list")) return "order";
    return null;
  };

  const type = getType();
  useEffect(() => {
    const init = async () => {
      if (!accessToken) await authRefreshToken();
      if (accessToken && !user) await authMe();
    };
    init();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const type = getType();
      if (type && keyword.trim()) {
        userSearchGlobal(type, keyword);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [keyword, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box")) {
        setKeyword("");
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
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
        <div className="flex-1 max-w-md mx-8">
          <div className="relative search-box">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 outline-0 focus:ring-orange-400"
            />
            
            {keyword && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
                {/* EMPTY */}
                {results &&
                  ((type === "product" && !results.products?.length) ||
                    (type === "order" && !results.orders?.length) ||
                    (type === "category" && !results.categories?.length) ||
                    (type === "user" && !results.users?.length)) && (
                    <p className="p-4 text-sm text-gray-400">
                      No results found
                    </p>
                  )}

                {type === "product" && results?.products?.length > 0 && (
                  <Group title="Products">
                    {results.products.map((p) => (
                      <Item
                        key={p._id}
                        onClick={() => navigate(`/admin/products/${p._id}`)}
                      >
                        <img
                          src={p.images?.[0]?.url || "/placeholder.png"}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-gray-500">${p.price}</p>
                        </div>
                      </Item>
                    ))}
                  </Group>
                )}

                {type === "order" && results?.orders?.length > 0 && (
                  <Group title="Orders">
                    {results.orders.map((o) => (
                      <Item
                        key={o._id}
                        onClick={() => navigate(`/admin/order-list/${o._id}`)}
                      >
                        <div>
                          <p className="text-sm font-medium">{o.orderCode}</p>
                          <p className="text-xs text-gray-500">
                            ${o.totalAmount} • {o.status}
                          </p>
                        </div>
                      </Item>
                    ))}
                  </Group>
                )}

                {type === "category" && results?.categories?.length > 0 && (
                  <Group title="Categories">
                    {results.categories.map((c) => (
                      <Item key={c._id}>{c.categoryName}</Item>
                    ))}
                  </Group>
                )}

                {type === "user" && results?.users?.length > 0 && (
                  <Group title="Users">
                    {results.users.map((u) => (
                      <Item key={u._id}>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </Item>
                    ))}
                  </Group>
                )}
              </div>
            )}
          </div>
        </div>
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
        <div className="absolute right-4 mt-4 w-64 bg-white rounded-xl shadow-lg z-50">
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
