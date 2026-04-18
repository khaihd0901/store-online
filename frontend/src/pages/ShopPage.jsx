import React from 'react';
import { Link } from 'react-router';

const ShopPage = () => {
const dummyProducts = [
    { id: 1, title: 'Psychology of Money', author: 'Morgan Housel', price: '$870', image: '/images/product-item1.png', badge: '10% off' },
    { id: 2, title: 'The Two Towers', author: 'J.R.R Tolkien', price: '$870', image: '/images/product-item2.png', badge: '' },
    { id: 3, title: 'Goal Planner', author: 'Lauren Asher', price: '$870', image: '/images/product-item3.png', badge: '' },
    { id: 4, title: 'House of Sky Breath', author: 'Lauren Asher', price: '$870', image: '/images/product-item4.png', badge: '' },
    { id: 5, title: 'Heartland Stars', author: 'Lauren Asher', price: '$870', image: '/images/product-item5.png', badge: '' },
    { id: 6, title: 'Heavenly Bodies', author: 'Lauren Asher', price: '$870', image: '/images/product-item6.png', badge: '' },
    { id: 7, title: 'His Saving Grace', author: 'Lauren Asher', price: '$870', image: '/images/product-item7.png', badge: '10% off' },
    { id: 8, title: 'My Dearest Darkest', author: 'Lauren Asher', price: '$870', image: '/images/product-item8.png', badge: '' },
    { id: 9, title: 'The Story of Success', author: 'Paul Jarvis', price: '$870', image: '/images/product-item9.png', badge: '' },
  ];

  return (
    <div className="bg-white pb-16 pt-10">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-wrap -mx-4">
          
          {/* CỘT TRÁI: SIDEBAR */}
          <div className="w-full lg:w-1/4 px-4 mb-10 lg:mb-0">
            
            {/* Ô Tìm kiếm */}
            <div className="flex items-center p-1.5 mb-10 border border-gray-300 rounded-xl bg-white focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400 transition-all">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full px-4 py-2 outline-none bg-transparent text-gray-700 placeholder-gray-500 font-medium" 
              />
              <button className="bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition-colors flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>

            {/* Categories */}
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">All</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Romance</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Recipie</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Sci-Fi</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Lifestyle</a></li>
              </ul>
            </div>

            {/* Tags */}
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Tags</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">Sci-Fi</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Revenge</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Zombie</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Vampire</a></li>
              </ul>
            </div>

            {/* Author */}
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Author</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">Hanna Clark</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Albert E. Beth</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">D.K John</a></li>
              </ul>
            </div>
            
            {/* Filter by price */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Filter by price</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">Less than $10</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">$10- $20</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">$20- $30</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">$30- $40</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">$40- $50</a></li>
              </ul>
            </div>

          </div>
          

          {/* CỘT PHẢI: LƯỚI SẢN PHẨM */}
          <div className="w-full lg:w-3/4 px-4">
            
            {/* Thanh Top Bar: Showing results & Sort */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <p className="text-gray-500 font-medium text-sm">Showing 1–9 of 55 results</p>
              
              <div className="relative">
                <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white cursor-pointer appearance-none pr-8 relative">
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by price</option>
                </select>
                {/* Icon mũi tên trỏ xuống */}
                <svg className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Grid Sản Phẩm (3 cột) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {dummyProducts.map((product) => (
                <div key={product.id} className="group border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  
                  {/* Container Ảnh */}
                  <div className="relative mb-4 flex items-center justify-center aspect-[3/4] overflow-hidden">
                    {/* Nhãn giảm giá */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-red-400 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                        {product.badge}
                      </span>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Thông tin Text */}
                  <div className="text-left mt-auto">
                    <h3 className="font-bold text-gray-900 mb-1 truncate hover:text-red-500 cursor-pointer">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{product.author}</p>
                    
                    {/* Ngôi sao đánh giá */}
                    <div className="flex text-yellow-400 mb-2 space-x-0.5">
                      {[1,2,3,4,5].map(star => (
                         <svg key={star} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    
                    <span className="text-red-500 font-bold">{product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang (Pagination) - ĐÃ XÓA VIỀN */}
            <div className="flex justify-center pt-8">
              <nav className="flex items-center space-x-2">
                <a href="#" className="text-gray-400 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors">Prev</a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white font-bold text-sm">1</a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors">2</a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors">3</a>
                <a href="#" className="text-gray-400 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors">Next</a>
              </nav>
            </div>

          </div>
        </div>
      </div>

      {/* Instagram Section ở cuối - ĐÃ XÓA VIỀN */}
      <section className="mt-20 pt-10 container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-8 text-gray-900">Instagram</h2>
        <div className="flex flex-wrap -mx-2">
           {[1,2,3,4,5,6].map(num => (
             <div key={num} className="w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-4 lg:mb-0">
               <img src={`/images/insta-item${num}.jpg`} alt="instagram" className="w-full aspect-square object-cover rounded hover:opacity-80 transition-opacity cursor-pointer" />
             </div>
           ))}
        </div>
      </section>

    </div>
  );
};

export default ShopPage;