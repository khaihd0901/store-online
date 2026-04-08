import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router";

const Layout = () => {

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-100">
      <Header />

      <main className="mx-auto container">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
