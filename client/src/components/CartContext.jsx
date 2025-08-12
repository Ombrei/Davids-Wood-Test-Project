import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.prodId === product.prodId);
      if (existing) {
        if (existing.quantity < product.stockQuantity) {
          return prevCart.map((item) =>
            item.prodId === product.prodId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert("Cannot add more. Product stock limit reached.");
          return prevCart;
        }
      } else {
        if (product.stockQuantity > 0) {
          return [...prevCart, { ...product, quantity: 1 }];
        } else {
          alert("This product is out of stock.");
          return prevCart;
        }
      }
    });
  };
  const removeFromCart = (prodId, forceRemove = false) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.prodId === prodId) {
            if (forceRemove || item.quantity <= 1) {
              return null;
            } else {
              return { ...item, quantity: item.quantity - 1 };
            }
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
