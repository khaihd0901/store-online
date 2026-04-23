import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useProductStore } from "../stores/productStore";
import { useUserStore } from "../stores/userStore";

const ProductPage = () => {
  const { id } = useParams();
  const { productGetById, product, isLoading, isError } = useProductStore();
  const { userAddToCart, userAddToWishlist } = useUserStore();

  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    productGetById(id);
  }, [id, productGetById]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Product not found.</h2>
        <p className="text-gray-600 mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    userAddToCart({ prodId: product._id, quantity });
  };

  const handleAddToWishlist = () => {
    userAddToWishlist(product._id);
  };

  const thumbnails = product.images || [];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-2/12 flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
            {thumbnails.map((img, index) => (
              <div
                key={index}
                onClick={() => setMainImage(img.url)}
                className={`border rounded-lg p-2 cursor-pointer transition-all flex-shrink-0 w-24 md:w-full aspect-[3/4] flex justify-center items-center ${mainImage === img.url ? 'border-red-400 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <img src={img.url} alt={`thumbnail ${index}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>

          <div className="w-full md:w-5/12">
            <div className="border border-gray-200 rounded-lg p-10 flex justify-center items-center aspect-[3/4] md:aspect-auto md:h-full">
              <img src={mainImage} alt={product.title} className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="w-full md:w-5/12 md:pl-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-red-400">${product.price}</span>
              {/* Nếu có giá cũ thì hiển thị, giả định backend chưa có field oldPrice nên tạm ẩn hoặc tính toán */}
              {product.oldPrice && <span className="text-lg text-gray-400 line-through">${product.oldPrice}</span>}
              <div className="flex text-yellow-400 border-l border-gray-300 pl-4 ml-2 space-x-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>

            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
              Written by <strong>{product.author}</strong>. {product.description || 'No description available for this product.'}
            </p>

            {/* <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Color</h4>
              <div className="flex gap-4 text-sm text-gray-600">
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="color" className="mr-1" defaultChecked /> Gray</label>
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="color" className="mr-1" /> Blue</label>
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="color" className="mr-1" /> White</label>
              </div>
            </div> */}

            {/* <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Size</h4>
              <div className="flex gap-6 text-sm text-gray-600">
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="size" className="mr-1" defaultChecked /> S</label>
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="size" className="mr-1" /> M</label>
                <label className="cursor-pointer hover:text-gray-900"><input type="radio" name="size" className="mr-1" /> L</label>
              </div>
            </div> */}

            <p className="text-sm text-gray-500 mb-3">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <div className="flex items-center border border-gray-200 rounded">
                <button onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 transition">-</button>
                <input type="text" value={quantity} readOnly className="w-12 text-center text-gray-900 outline-none" />
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 transition">+</button>
              </div>

              <button className="bg-red-400 text-white px-8 py-2.5 rounded font-medium hover:bg-red-500 transition shadow-sm">Order now</button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="bg-[#1a202c] text-white px-6 py-2.5 rounded font-medium hover:bg-black transition shadow-sm disabled:bg-gray-400"
              >
                Add to cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="bg-[#1a202c] text-white p-2.5 rounded hover:bg-black transition shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>

            <ul className="text-sm text-gray-500 space-y-2">
              <li><span className="text-gray-900 font-semibold mr-2">SKU:</span> {product._id?.slice(-8).toUpperCase()}</li>
              <li>
                <span className="text-gray-900 font-semibold mr-2">Category:</span>
                {product.category?.map(cat => cat.title).join(', ') || 'General'}
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;