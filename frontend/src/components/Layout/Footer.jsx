import React from 'react';
import { Link } from 'react-router'; 

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 bg-white">
      
      {/* ĐÃ SỬA: Xóa md:px-10 để lề ngoài cùng bằng đúng lề của BookLists */}
      <div className="container mx-auto px-4 mb-20">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-900">Instagram</h2>
        <div className="flex flex-wrap -mx-2">
           {[1, 2, 3, 4, 5, 6].map(num => (
             <div key={num} className="w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4 lg:mb-0">
               <img src={`/images/insta-item${num}.jpg`} alt={`instagram ${num}`} className="w-full aspect-square object-cover rounded hover:opacity-80 transition-opacity cursor-pointer shadow-sm" />
             </div>
           ))}
        </div>
      </div>

      {/* ĐÃ SỬA: Xóa md:px-10 để 4 cột Footer thẳng tắp với khung trên */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Cột 1: Giới thiệu */}
          <div>
            <img src="/images/main-logo.png" alt="logo" className="mb-6 h-10 object-contain" />
            <p className="text-gray-500 mb-6 leading-relaxed">
              Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><svg className="w-6 h-6"><use xlinkHref="#facebook" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><svg className="w-6 h-6"><use xlinkHref="#instagram" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><svg className="w-6 h-6"><use xlinkHref="#twitter" /></svg></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><svg className="w-6 h-6"><use xlinkHref="#youtube" /></svg></a>
            </div>
          </div>

          {/* Cột 2: Menu Nhanh */}
          <div>
            <h5 className="font-bold text-lg mb-6 text-gray-900">Quick Links</h5>
            <ul className="space-y-3 font-medium">
              <li><Link to="/" className="text-gray-500 hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-red-500 transition-colors">About</Link></li>
              <li><Link to="/shop" className="text-gray-500 hover:text-red-500 transition-colors">Shop</Link></li>
              <li><Link to="/blogs" className="text-gray-500 hover:text-red-500 transition-colors">Blogs</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h5 className="font-bold text-lg mb-6 text-gray-900">Help & Info</h5>
            <ul className="space-y-3 font-medium">
              <li><a href="#" className="text-gray-500 hover:text-red-500 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-500 transition-colors">Returns Policies</a></li>
              <li><a href="#" className="text-gray-500 hover:text-red-500 transition-colors">Shipping + Delivery</a></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-gray-500 hover:text-red-500 transition-colors">Faqs</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h5 className="font-bold text-lg mb-6 text-gray-900">Contact Us</h5>
            <p className="text-gray-500 mb-4 font-medium">Do you have any queries or suggestions? <br/><a href="mailto:yourinfo@gmail.com" className="text-red-500 hover:underline">yourinfo@gmail.com</a></p>
            <p className="text-gray-500 font-medium">If you need support? Just give us a call. <br/><a href="tel:+5511122233344" className="text-red-500 hover:underline">+55 111 222 333 44</a></p>
          </div>

        </div>
      </div>

      {/* ĐÃ SỬA: Xóa md:px-10 */}
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-900 mr-3">We ship with:</span>
              <img src="/images/dhl.png" alt="dhl" className="h-6 object-contain mr-2" />
              <img src="/images/shippingcard.png" alt="shipping" className="h-6 object-contain" />
            </div>
            <div className="flex items-center border-l border-gray-200 pl-6">
              <span className="text-sm font-semibold text-gray-900 mr-3">Payment options:</span>
              <img src="/images/visa.jpg" alt="visa" className="h-6 object-contain mr-2" />
              <img src="/images/mastercard.jpg" alt="mastercard" className="h-6 object-contain mr-2" />
              <img src="/images/paypal.jpg" alt="paypal" className="h-6 object-contain" />
            </div>
          </div>
          
          <p className="text-sm text-gray-500 font-medium">
            © 2024 Bookly. React Version Built by You.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;