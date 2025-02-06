// src/app/component/CartButton.tsx
"use client";

import React, { useContext } from "react";
import { CartItem } from "@/types";
import { CartContext } from "./CartContext";

function CartButton({ cartItem }: { cartItem: CartItem }) {
  const { addToCart } = useContext(CartContext);

  return (
    <button
      className="bg-[#2A254B] h-[56px] w-[143px] flex justify-center items-center text-white"
      onClick={() => addToCart(cartItem)}
    >
      Add to cart
    </button>
  );
}

export default CartButton;
