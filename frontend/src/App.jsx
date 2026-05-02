import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/UserProfile.jsx";
import Order from "./pages/Order.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import WishList from "./pages/WishList.jsx";
import Cart from "./pages/Cart.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import About from "./pages/About.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Contact from "./pages/Contact.jsx";

import { useUserStore } from "./stores/userStore.js";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore.js";
import Checkout from "./pages/Checkout.jsx";
function App() {
  const userGetCart = useUserStore((state) => state.userGetCart);
  const userGetWishlist = useUserStore((state) => state.userGetWishlist);
  const { accessToken } = useAuthStore();
  useEffect(() => {
    if (accessToken) {
      userGetWishlist();
      userGetCart();
    }
  }, []);
  
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />


          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          
            <Route path="/cart" element={<Cart />} />
          {/* <Route path="/products" element={<OurShop />} />
          <Route path="/products/:id" element={<ProductDetail />} /> */}

          {/* private route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/wish-list" element={<WishList />} />
            <Route path="/checkout" element={<Checkout />} />
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
