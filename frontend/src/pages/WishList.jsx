import { useState } from "react";

const wishlistMock = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: "$18.00",
    image: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    price: "$15.00",
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
  },
];

export default function WishList() {
  const [wishlist, setWishlist] = useState(wishlistMock);

  const removeItem = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">
          My Wishlist
        </h2>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 mb-4">
              Your wishlist is empty.
            </p>
            <button className="bg-black text-white px-6 py-2 rounded-lg">
              Browse Books
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlist.length > 0 && (
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow hover:shadow-md transition p-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full object-cover rounded-lg mb-3"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {item.author}
                </p>

                <p className="font-medium mb-3">{item.price}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-black text-white py-2 rounded-lg text-sm hover:bg-gray-800">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-2 border rounded-lg text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}