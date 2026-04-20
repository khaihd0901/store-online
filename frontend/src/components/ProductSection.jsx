import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from './ProductCard';

const mockProducts = [
  { id: 1, title: "House of Sky Breath", author: "Lauren Asher", price: 870, image: "/images/product-item1.png" },
  { id: 2, title: "Heartland Stars", author: "Lauren Asher", price: 870, image: "/images/product-item2.png" },
  { id: 3, title: "Heavenly Bodies", author: "Lauren Asher", price: 870, image: "/images/product-item3.png" },
  { id: 4, title: "His Saving Grace", author: "Lauren Asher", price: 870, image: "/images/product-item4.png" },
  { id: 5, title: "My Dearest Darkest", author: "Lauren Asher", price: 870, image: "/images/product-item5.png" },
  { id: 6, title: "The Story of Success", author: "Lauren Asher", price: 870, image: "/images/product-item6.png" },
];

const ProductSection = ({ title }) => {
  return (
    <section className="relative py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 relative">
        
        {/* Tiêu đề & Nút View All */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h3 className="text-4xl font-semibold text-gray-900">{title}</h3>
          <a href="/shop" className="mt-4 md:mt-0 px-6 py-2.5 bg-red-400 text-white rounded-lg font-medium hover:bg-red-500 transition-colors shadow-sm">
            View All
          </a>
        </div>

        {/* Khung chứa Swiper Slider và Custom Arrows */}
        {/* ĐÃ SỬA: Thêm class group để tạo hiệu ứng hover (tùy chọn) */}
        <div className="relative w-full">
          
          {/* ĐÃ SỬA: Thay '-left-5' thành 'left-0 md:left-2'. 
              Nút sẽ nằm gọn bên trong viền, nổi lên trên quyển sách một chút, KHÔNG BAO GIỜ bị cắt lẹm nữa. */}
          <button className="custom-prev-btn absolute top-[35%] left-0 md:left-2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true} 
            navigation={{
              nextEl: '.custom-next-btn',
              prevEl: '.custom-prev-btn',
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 }, 
            }}
            className="py-4"
          >
            {mockProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard {...product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ĐÃ SỬA: Thay '-right-5' thành 'right-0 md:right-2'. */}
          <button className="custom-next-btn absolute top-[35%] right-0 md:right-2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
};

export default ProductSection;