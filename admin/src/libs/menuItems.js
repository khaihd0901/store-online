import { BarChart3, Database, LayoutDashboard, MessageCircleCode, MessageCircleIcon, ShoppingBag, Users } from "lucide-react";

const menuItems = [
  {
    id: "catalog",
    icon: Database,
    label: "Catalog",
     submenu: [
      { id: "products", label: "Book List" },
      { id: "categories", label: "Category List" },
      { id: "coupons", label: "Coupon List" },
    ],
  },
  {
    id: "users",
    icon: Users,
    label: "Users",
    submenu: [
      { id: "all-users", label: "Users" },
      { id: "deleted-users", label: "Deleted Users" },
      // { id: "activity", label: "User Activity" },
    ],
  },
  {
    id: "orders",
    icon: ShoppingBag,
    label: "Orders",
    count:'2.4k',
    submenu: [
      { id: "order-list", label: "Orders List" },
      // { id: "order", label: "Order Detail" },
    ],
  },
];

export default menuItems
