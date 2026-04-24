import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useUserStore } from "@/stores/userStore";
import { useProductStore } from "../stores/productStore";
// import { useCategoryStore } from "../stores/categoryStore";
import { useCallback } from "react";
import Badge from "@/components/Badge";
import { useAuthStore } from "@/stores/authStore";
const ShopPage = () => {
  const { userAddToWishlist, userAddToCart } = useUserStore();
  const { user } = useAuthStore();
  const {
    productSearch,
    pagination,
    clearState,
    productDeleteById,
    isLoading,
    products,
  } = useProductStore();
  // const { categoryGetAll, categories } = useCategoryStore();

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async () => {
    const params = {
      page,
      limit,
      sort: `${sort === "asc" ? "" : "-"}${sortKey}`,
      ...filters,
    };

    if (search) params.search = search;

    await productSearch(params);
  }, [page, limit, sortKey, sort, search, filters, productSearch]);

  useEffect(() => {
    // categoryGetAll();
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-white ">
      <Badge to={"Our Shop"} title={"Our Shop"} />
      <div className="container mx-auto pb-16 pt-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ================= CỘT TRÁI: SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 self-start">
              {/* Thanh Search */}
              <div className="flex items-center p-1.5 mb-10 border border-gray-300 rounded-xl bg-white focus-within:border-red-400 focus-within:ring-1 focus-within:ring-red-400 transition-all">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 outline-none bg-transparent text-gray-700 placeholder-gray-500 font-medium"
                />
                <button className="bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition-colors shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>

              {/* Danh mục (Categories) */}
              <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  Categories
                </h3>
                <ul className="space-y-3 text-gray-500 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Romance
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Recipie
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Sci-Fi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Lifestyle
                    </a>
                  </li>
                </ul>
              </div>

              {/* Thẻ (Tags) */}
              <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Tags</h3>
                <ul className="space-y-3 text-gray-500 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Sci-Fi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Revenge
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Zombie
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Vampire
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tác giả (Author) */}
              <div className="mb-10">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Author</h3>
                <ul className="space-y-3 text-gray-500 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Hanna Clark
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Albert E. Beth
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      D.K John
                    </a>
                  </li>
                </ul>
              </div>

              {/* Lọc theo giá (Filter by price) */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900">
                  Filter by price
                </h3>
                <ul className="space-y-3 text-gray-500 text-sm font-medium">
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      Less than $10
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      $10- $20
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      $20- $30
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      $30- $40
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-red-500 transition-colors block"
                    >
                      $40- $50
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ================= CỘT PHẢI: LƯỚI SẢN PHẨM ================= */}
          <div className="lg:col-span-3">
            {/* Thanh Sort */}
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <p className="text-gray-500 font-medium text-sm">
                Showing results
              </p>
              <div className="relative">
                <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 bg-white cursor-pointer appearance-none pr-8 relative">
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by price</option>
                </select>
                <svg
                  className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            {/* 3. HIỂN THỊ DỮ LIỆU */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20 w-full h-full">
                <p className="text-gray-500 font-medium text-lg">
                  Đang tải sản phẩm...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {products?.map((product) => {
                  // Xử lý linh hoạt: Nếu API có mảng images (như The Avengers) thì lấy ảnh đầu tiên
                  const displayImage =
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : product.image;

                  // Hỗ trợ cả ID kiểu MongoDB (_id) và ID thường (id)
                  const productId = product._id || product.id;

                  return (
                    <ProductCard
                      key={productId}
                      id={productId}
                      image={displayImage}
                      title={product.title}
                      author={product.author}
                      price={product.price}
                      // Truyền ID chuẩn xác vào các hàm trong store
                      onClickWishlist={() => userAddToWishlist(productId)}
                      onClickAddCart={async () => {
                        const productData = {
                          prodId: productId,
                          title: product.title,
                          author: product.author,
                          price: product.price,
                          stock: product.stock,
                          images:
                            product.images && product.images.length > 0
                              ? product.images
                              : [{ url: displayImage }],
                        };
                        await userAddToCart(productData);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Phân trang (Pagination) */}
            <div className="flex justify-center pt-8">
              <nav className="flex items-center space-x-2">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Prev
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded bg-red-400 text-white font-bold text-sm"
                >
                  1
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors"
                >
                  2
                </a>
                <a
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-100 font-bold text-sm transition-colors"
                >
                  3
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-900 px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
