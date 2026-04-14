import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const LimitedOffer = () => {
  // Logic đếm ngược thời gian thực
  const [timeLeft, setTimeLeft] = useState({
    days: 2, hours: 14, minutes: 30, seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else { hours = 23; if (days > 0) days--; }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-10 h-full">
        <div className="flex flex-col md:flex-row items-center h-full">
          
          {/* Ảnh bên trái */}
          <div className="w-full md:w-1/2 text-center mb-10 md:mb-0">
            <img src="/images/banner-image3.png" className="w-full max-w-lg mx-auto drop-shadow-2xl" alt="Limited time offer" />
          </div>

          {/* Nội dung bên phải */}
          <div className="w-full md:w-5/12 md:ml-8 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
              30% Discount on all items. Hurry Up !!!
            </h2>

            {/* Đồng hồ đếm ngược */}
            <div className="flex items-center justify-center md:justify-start mb-10 space-x-4">
              <div className="text-center w-16">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">{timeLeft.days}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Days</p>
              </div>
              <span className="text-4xl md:text-5xl text-red-500 font-light pb-6">:</span>
              
              <div className="text-center w-16">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">{timeLeft.hours}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Hrs</p>
              </div>
              <span className="text-4xl md:text-5xl text-red-500 font-light pb-6">:</span>
              
              <div className="text-center w-16">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">{timeLeft.minutes}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Min</p>
              </div>
              <span className="text-4xl md:text-5xl text-red-500 font-light pb-6">:</span>
              
              <div className="text-center w-16">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">{timeLeft.seconds}</span>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">Sec</p>
              </div>
            </div>

            <Link to="/shop" className="inline-block px-10 py-4 bg-gray-900 text-white rounded font-medium hover:bg-red-500 transition-colors shadow-lg transform hover:-translate-y-1">
              Shop Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LimitedOffer;