import React from "react";
import { Link } from "react-router";

const Badge = ({to, title}) => {
  return (
    <section
      className="relative py-20 bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/banner-image-bg.jpg')" }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">{title}</h1>
        <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>{">"}</span>
          <span className="font-semibold text-gray-900">{to}</span>
        </div>
      </div>
      {/* Optional Overlay to make text more readable if background is busy */}
      <div className="absolute inset-0 bg-white/30"></div>
    </section>
  );
};

export default Badge;
