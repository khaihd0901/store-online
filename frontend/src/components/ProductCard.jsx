import React from 'react';
import { Link } from 'react-router'; 

const ProductCard = ({ id, image, title, author, price, onClickWishlist }) => {
  return (
    <>
    <div to={`/product/${id}`} className="block group relative p-6 border border-gray-100 rounded-xl hover:shadow-xl transition-shadow duration-300 bg-white h-full cursor-pointer">
      
      <div className="flex justify-center mb-4">
        <img src={image} className="w-full max-w-[200px] h-[280px] object-contain shadow-sm group-hover:scale-105 transition-transform duration-500" alt={title} />
      </div>

      <h6 className="mt-4 mb-1 font-bold text-lg truncate hover:text-red-500 transition-colors">
        {title}
      </h6>
      
      <div className="flex items-center justify-between mb-3">
        <p className="my-1 text-sm text-gray-500 truncate">{author}</p>
        <div className="rating text-yellow-400 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 fill-current"><use xlinkHref="#star-fill"></use></svg>
          ))}
        </div>
      </div>
      
      <span className="price text-red-500 font-bold text-xl">${price}</span>

      <div className="card-concern absolute left-0 right-0 bottom-6 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button type="button" onClick={(e) => { e.preventDefault(); }} className="p-3 bg-gray-900 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0">
          <svg className="w-5 h-5"><use xlinkHref="#cart"></use></svg>
        </button>
        <button type="button" onClick={onClickWishlist} className="p-3 bg-gray-900 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg transform translate-y-2 group-hover:translate-y-0">
          <svg className="w-5 h-5"><use xlinkHref="#heart"></use></svg>
        </button>
      </div>
    </div>
    </>
  );
};

export default ProductCard;