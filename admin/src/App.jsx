import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout/Layout";
import DashBoard from "./pages/Dashboards/Dashboards";
import Products from "./pages/Products/Products";
import Login from "./pages/Login";
import Orders from "./pages/Orders/Orders";
import ForgotPassword from "./pages/ForgotPassword";
import Categories from "./pages/Categories/Categories";
import Brands from "./pages/Brands/Brands";
import Users from "./pages/Users/Users";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/*Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<DashBoard />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="order-list" element={<Orders />} />
              <Route path="all-users" element={<Users />} />
            </Route>
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
