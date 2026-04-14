import React from 'react';
import { Link } from 'react-router';

const Hero = () => {
  return (
    <section id="billboard" className="relative flex items-center py-12 lg:py-24 bg-gray-50 bg-cover bg-no-repeat bg-center">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex flex-col-reverse md:flex-row items-center">
          
          {/* Cột Chữ */}
          <div className="md:w-6/12 md:pr-8 mt-10 md:mt-0 text-center md:text-left z-10">
            <div className="banner-content">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 leading-tight">
                The Fine Print Book Collection
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Best Offer Save 30%. Grab it now!
              </p>
              <Link to="/shop" className="inline-block px-10 py-4 bg-gray-900 text-white rounded font-medium hover:bg-red-400 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Cột Ảnh */}
          <div className="md:w-6/12 text-center relative z-10">
            <div className="image-holder">
              {/* Đảm bảo ảnh này có trong thư mục public/images/ của bạn */}
              <img src="/images/banner-image2.png" className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-sm" alt="The Fine Print" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;