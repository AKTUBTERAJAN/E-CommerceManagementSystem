import { createContext, useContext, useEffect, useState } from "react";

import {getCart,addToCart as addCartAPI,removeCartItem} from "../../api/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart on app start
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();

const cartData = res.map((item) => ({
  id: item._id,
  productId: item.product._id,

  subcategory_name: item.product.subcategory_name,
  product_quantity: item.product.product_quantity,
  product_pic: item.product.product_pic,

  discount_price: item.product.discount_price,
  price: item.product.price,
  total_discount: item.product.total_discount,

  quantity: item.quantity,
  total_price: item.total_price,

  added_date: new Date(item.added_date).toLocaleDateString(),
}));

      setCart(cartData);
    } catch (err) {
      console.log("Load Cart Error :", err);
    }
  };

  // Add Product
  const addToCart = async (product, qty) => {
    try {
      await addCartAPI(product._id, qty);

      await loadCart();

      alert("Product Added Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // Remove Product
  const removeCart = async (cartId) => {
    try {
      await removeCartItem(cartId);

      await loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);