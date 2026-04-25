import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from './ProductCard';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '@/stores/userStore';

const ProductSection = ({ title }) => {
  const { bestSellingProducts, productGetBestSelling, isLoading } = useProductStore();
  const { userAddToWishlist, userAddToCart } = useUserStore();

  useEffect(() => {
    productGetBestSelling();
  }, []);

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
        <div className="relative w-full">
          
          <button className="custom-prev-btn absolute top-[35%] left-0 md:left-2 -translate-y-1/2 z-40 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={bestSellingProducts.length > 5} 
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
              {bestSellingProducts.map((product) => (
                <SwiperSlide key={product._id}>

                                      <ProductCard
                      key={product._id}
                      id={product._id}
                       image={product.images && product.images.length > 0 ? product.images[0].url : "/images/placeholder.png"}
                      title={product.title}
                      author={product.author}
                      price={product.price}
                      // Truyền ID chuẩn xác vào các hàm trong store
                      onClickWishlist={() => userAddToWishlist(product._id)}
                      onClickAddCart={async () => {
                        const productData = {
                          prodId: product._id,
                          title: product.title,
                          author: product.author,
                          price: product.price,
                          stock: product.stock,
                          images:
                            product.images && product.images.length > 0
                              ? product.images
                              : [{ url: product.images[0].url}],
                        };
                        await userAddToCart(productData);
                      }}
                    />
                  {/* <ProductCard 
                    id={product._id}
                    title={product.title}
                    author={product.author}
                    price={product.price}
                    image={product.images && product.images.length > 0 ? product.images[0].url : "/images/placeholder.png"}
                    onClickWishlist={() => userAddToWishlist(product._id)}
                    onClickAddCart={() =>
                      userAddToCart({
                        cart: [
                          {
                            prodId: product._id,
                            quantity: 1,
                            price: product.price,
                          },
                        ],
                      })
                    }
                  /> */}
                </SwiperSlide>
              ))}
            </Swiper>
          )}

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