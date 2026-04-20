import React from 'react';

// --- COMPONENT NHỎ CẤP DƯỚI: Hiển thị 1 cuốn sách dạng ngang ---
const SmallBookItem = ({ title, author, price, oldPrice, image, isLast }) => {
  return (
    // Nếu là item cuối cùng thì không vẽ đường kẻ dưới (border-b)
    <div className={`flex items-center ${isLast ? '' : 'border-b border-gray-100 pb-4 mb-4'}`}>
      
      {/* Cột ảnh (Bên trái) */}
      <div className="w-20 h-28 flex-shrink-0 bg-white overflow-hidden rounded flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-full object-contain" />
      </div>

      {/* Cột chữ (Bên phải) */}
      <div className="ml-4 flex flex-col flex-grow">
        <h4 className="font-bold text-gray-900 text-[15px] hover:text-red-500 cursor-pointer line-clamp-1 mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-500 mb-2">{author}</p>
        
        {/* Đánh giá 5 sao */}
        <div className="flex text-yellow-400 mb-2 space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>

        {/* Giá tiền */}
        <div className="flex items-center text-sm">
          {/* Nếu có giá cũ (On Sale) thì hiển thị gạch ngang chữ xám */}
          {oldPrice && <span className="text-gray-400 line-through mr-2">{oldPrice}</span>}
          <span className="text-red-500 font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
const BookLists = () => {
  // Dữ liệu giả lập chia làm 4 cột
  const columns = [
    {
      title: "Featured",
      items: [
        { id: 1, title: "Echoes of the Ancients", author: "Lauren Asher", price: "$870", image: "/images/product-item2.png" },
        { id: 2, title: "The Midnight Garden", author: "Lauren Asher", price: "$870", image: "/images/product-item1.png" },
        { id: 3, title: "Shadow of the Serpent", author: "Lauren Asher", price: "$870", image: "/images/product-item3.png" },
      ]
    },
    {
      title: "Latest items",
      items: [
        { id: 4, title: "Whispering Winds", author: "Lauren Asher", price: "$870", image: "/images/product-item4.png" },
        { id: 5, title: "The Forgotten Realm", author: "Lauren Asher", price: "$870", image: "/images/product-item5.png" },
        { id: 6, title: "Moonlit Secrets", author: "Lauren Asher", price: "$870", image: "/images/product-item6.png" },
      ]
    },
    {
      title: "Best reviewed",
      items: [
        { id: 7, title: "The Crystal Key", author: "Lauren Asher", price: "$870", image: "/images/product-item7.png" },
        { id: 8, title: "Starlight Sonata", author: "Lauren Asher", price: "$870", image: "/images/product-item8.png" },
        { id: 9, title: "Tales of the Enchanted Forest", author: "Lauren Asher", price: "$870", image: "/images/product-item9.png" },
      ]
    },
    {
      title: "On sale",
      items: [
        { id: 10, title: "The Phoenix Chronicles", author: "Lauren Asher", price: "$999", oldPrice: "$1666", image: "/images/product-item10.png" },
        { id: 11, title: "Dreams of Avalon", author: "Lauren Asher", price: "$999", oldPrice: "$1666", image: "/images/product-item1.png" },
        { id: 12, title: "Legends of the Dragon Isles", author: "Lauren Asher", price: "$999", oldPrice: "$1666", image: "/images/product-item2.png" },
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Lưới 4 cột (1 cột trên mobile, 2 trên tablet, 4 trên PC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {columns.map((column, index) => (
            // Khung của mỗi cột
            <div key={index} className="border border-gray-100 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{column.title}</h3>
              
              <div>
                {column.items.map((book, i) => (
                  <SmallBookItem 
                    key={book.id} 
                    {...book} 
                    // Truyền prop isLast để biết cuốn nào là cuốn cuối cùng (không gạch viền dưới)
                    isLast={i === column.items.length - 1} 
                  />
                ))}
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default BookLists;