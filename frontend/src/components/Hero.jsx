import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "The Fine Print Book Collection",
      subtitle: "Best Offer Save 30%. Grab it now!",
      image: "/images/banner-image2.png",
      buttonText: "Shop Collection"
    },
    {
      id: 2,
      title: "How Innovation works",
      subtitle: "Discount available. Grab it now!",
      image: "/images/banner-image1.png",
      buttonText: "Shop Product"
    },
    {
      id: 3,
      title: "Your Heart is the Sea",
      subtitle: "Limited stocks available. Grab it now!",
      image: "/images/banner-image.png",
      buttonText: "Shop Collection"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // ĐÃ SỬA: Cập nhật đúng tên file ảnh nền của bạn là banner-image-bg.jpg
    <section 
      id="billboard" 
      className="relative flex items-center py-12 lg:py-24 bg-cover bg-no-repeat bg-center overflow-hidden bg-[url('/images/banner-image-bg.jpg')]"
    >
      
      {/* Nút Prev (Mũi tên trái) */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 md:left-6 lg:left-10 z-20 flex justify-center items-center p-3 text-gray-800 hover:text-red-500 transition-colors"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Khung chứa các slide */}
      <div className="w-full relative z-10">
        <div 
          className="flex transition-transform duration-700 ease-in-out" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="w-full flex-shrink-0">
              <div className="container mx-auto px-16 md:px-24 lg:px-32">
                <div className="flex flex-col-reverse md:flex-row items-center">
                  
                  {/* Cột Chữ */}
                  <div className="md:w-6/12 md:pr-8 mt-10 md:mt-0 text-center md:text-left z-10">
                    <div className="banner-content">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-600 mb-8">
                        {slide.subtitle}
                      </p>
                      <Link to="/shop" className="inline-block px-8 py-3.5 bg-red-400 text-white rounded font-medium hover:bg-red-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        {slide.buttonText}
                      </Link>
                    </div>
                  </div>

                  {/* Cột Ảnh */}
                  <div className="md:w-6/12 text-center md:flex md:justify-end relative z-10">
                    <div className="image-holder w-full flex justify-center md:justify-end">
                      <img src={slide.image} className="w-full max-w-[280px] md:max-w-sm lg:max-w-md drop-shadow-2xl rounded-sm object-contain" alt={slide.title} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút Next (Mũi tên phải) */}
      <button 
        onClick={nextSlide}
        className="absolute right-2 md:right-6 lg:right-10 z-20 flex justify-center items-center p-3 text-gray-800 hover:text-red-500 transition-colors"
      >
        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </section>
  );
};

export default Hero;