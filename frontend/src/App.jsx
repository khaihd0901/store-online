import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import HomePage from "./pages/HomePage.jsx";
import Register from "./pages/Register.jsx";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import AuthRoute from "./components/AuthRoute.jsx";
import ShopPage from "./pages/ShopPage.jsx";
function App() {
  return (
    <BrowserRouter>
    <Toaster richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="shop" element={<ShopPage />} />
          {/* <Route path="/products" element={<OurShop />} />
          <Route path="/products/:id" element={<ProductDetail />} /> */}

          {/* private route */}
          <Route element={<ProtectedRoute />}>
          <Route path="/me" element={<Profile />} />
          {/* <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/wish-list" element={<WishList />} />
          <Route path="/check-out" element={<CheckOut />} />
          <Route path="/order-history" element={<OrderHistory />} /> */}
        </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
