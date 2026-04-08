import { BarChart3, Database, LayoutDashboard, MessageCircleCode, MessageCircleIcon, ShoppingBag, Users } from "lucide-react";

const menuItems = [
  {
    id: "catalog",
    icon: Database,
    label: "Catalog",
    submenu: [
      { id: "products", label: "Product List" },   
      { id: "categories", label: "Category List" },
      // { id: "colors", label: "Color List" },
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
  {
    id: "users",
    icon: Users,
    label: "Users",
    submenu: [
      { id: "all-users", label: "All Users" },
      // { id: "activity", label: "User Activity" },
    ],
  },
];

export default menuItems
