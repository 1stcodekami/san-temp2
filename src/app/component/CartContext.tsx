// src/app/component/CartContext.tsx
"use client";

import React, { createContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

interface CartContextProps {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void; // Add this line
}

export const CartContext = createContext<CartContextProps>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {}, // Add this line
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage when the component mounts
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCartItems);
  }, []);

  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      // If the item is already in the cart, update its quantity
      updatedCart = cartItems.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      // Add the new item to the cart
      updatedCart = [...cartItems, { ...item }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Item added to cart!");
  };

  // Add the removeFromCart function
  const removeFromCart = (id: string) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
