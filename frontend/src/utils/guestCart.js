const KEY = "guest_cart";

export const getGuestCart = () =>
  JSON.parse(localStorage.getItem(KEY)) || [];

export const saveGuestCart = (cart) =>
  localStorage.setItem(KEY, JSON.stringify(cart));

export const clearGuestCart = () =>
  localStorage.removeItem(KEY);

export const addToGuestCart = (product) => {
  let cart = getGuestCart();

  const exist = cart.find((i) => i.prodId === product.prodId);

  if (exist) {
    exist.quantity += 1;
  } else {
    cart.push({
      prodId: product.prodId,
      quantity: 1,
      price: product.price,
      prodData: {
        title: product.title,
        author: product.author,
        stock: product.stock || 999,
        price: product.price,
        images: product.images && product.images.length > 0
          ? product.images
          : [
              {
                url: product.image || "/placeholder.png",
              },
            ],
      },
    });
  }

  saveGuestCart(cart);
};