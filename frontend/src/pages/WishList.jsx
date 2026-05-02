import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function WishList() {
  const { userGetWishlist, userRemoveFromWishlist, wishlist, userAddToCart } =
    useUserStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    userGetWishlist();
  }, []);
  const confirmRemove = async () => {
    await userRemoveFromWishlist(selectedId);
    await userGetWishlist();
    setShowConfirm(false);
    setSelectedId(null);
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
            {wishlist.map((item) => {
              const displayImage =
                item.images && item.images.length > 0
                  ? item.images[0].url
                  : item.image;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow hover:shadow-md transition p-4"
                >
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="h-48 mx-auto object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{item.author}</p>

                  <p className="font-medium mb-3">{item.price} $</p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={item.stock === 0}
                      onClick={async () => {
                        const productData = {
                          prodId: item._id,
                          title: item.title,
                          author: item.author,
                          price: item.price,
                          stock: item.stock,
                          images:
                            item.images && item.images.length > 0
                              ? item.images
                              : [{ url: displayImage }],
                        };
                        await userAddToCart(productData);
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
                      onClick={() => {
                        setSelectedId(item._id);
                        setShowConfirm(true);
                      }}
                      className="px-3 py-2 border rounded-lg text-red-500 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-3">Remove item?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to remove this item from your wishlist?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
