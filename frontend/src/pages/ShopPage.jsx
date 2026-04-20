import React from 'react';
import { Link } from 'react-router'; // Lưu ý: Thường dùng react-router-dom
// ĐÃ SỬA 1: Import component ProductCard vào ShopPage
import ProductCard from '../components/ProductCard'; 

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

            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Tags</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">Sci-Fi</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Revenge</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Zombie</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Vampire</a></li>
              </ul>
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Author</h3>
              <ul className="space-y-3 text-gray-500 text-sm font-medium">
                <li><a href="#" className="hover:text-red-500 transition-colors block">Hanna Clark</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">Albert E. Beth</a></li>
                <li><a href="#" className="hover:text-red-500 transition-colors block">D.K John</a></li>
              </ul>
            </div>
            
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
            
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <p className="text-gray-500 font-medium text-sm">Showing 1–9 of 55 results</p>
              
              <div className="relative">
                <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white cursor-pointer appearance-none pr-8 relative">
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by price</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* ĐÃ SỬA 2: Xóa code cứng, thay bằng component ProductCard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
              {dummyProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id} // Truyền ID sang để Link biết đường chuyển trang
                  image={product.image}
                  title={product.title}
                  author={product.author}
                  price={product.price}
                />
              ))}
            </div>

            {/* Phân trang (Pagination) */}
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
    </div>
  );
};

export default ShopPage;