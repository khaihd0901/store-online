import React from 'react';
// Import thư viện Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
// Import CSS của Swiper
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from './ProductCard';

// Dữ liệu giả lập lấy từ ảnh của template
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
      <div className="container mx-auto px-4 md:px-10 relative">
        
        {/* Tiêu đề & Nút View All */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
          <a href="/shop" className="mt-4 md:mt-0 px-8 py-2.5 bg-gray-900 text-white rounded font-medium hover:bg-red-500 transition-colors shadow-sm">
            View All
          </a>
        </div>

        {/* Khung chứa Swiper Slider */}
        <div className="px-2 py-4">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation // Bật nút mũi tên trái/phải
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Tự động trượt
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-8"
          >
            {mockProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard {...product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default ProductSection;