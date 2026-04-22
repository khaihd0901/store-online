import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { Link } from "react-router";

export default function WishList() {
  const { userGetWishlist, userRemoveFromWishlist, wishlist, userAddToCart } =
    useUserStore();
  useEffect(() => {
    userGetWishlist();
  }, []);
  const removeItem = async (id) => {
    await userRemoveFromWishlist(id);
    await userGetWishlist();
  };
  return (
    <div className="bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

        {/* Empty State */}
        {wishlist?.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
            <Link
              to="/shop"
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* Wishlist Items */}
        {wishlist?.length > 0 && (
          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
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
                <p className="text-xs text-gray-500 mb-2">{item.author}</p>

                <p className="font-medium mb-3">{item.price}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={item.stock === 0}
                    onClick={() => {
                      if (item.stock === 0) return;

                      userAddToCart({
                        cart: [
                          {
                            prodId: item._id,
                            quantity: 1,
                          },
                        ],
                      });
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm transition
    ${
      item.stock === 0
        ? "bg-red-500 cursor-not-allowed text-white"
        : "bg-black text-white hover:bg-gray-800"
    }
  `}
                  >
                    {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
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
