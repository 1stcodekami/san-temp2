// src/app/Cart/page.tsx

"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartContext } from "../component/CartContext";
import { CartItem } from "@/types";

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Recalculate subtotal whenever cartItems change
    calculateSubtotal(cartItems);
  }, [cartItems]);

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    setSubtotal(total);
  };

  return (
    <div className="w-full px-4 md:px-20 bg-[#F9F9F9] py-8">
      <div>
        <h1 className="text-[28px] md:text-[36px] text-[#2A254B] font-normal mb-6">
          Your shopping cart
        </h1>

        <div className="hidden md:flex justify-between items-center mb-4">
          <p className="text-[14px] text-gray-600">Product</p>
          <p className="text-[14px] text-gray-600">Total</p>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0"
            >
              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={109}
                  height={134}
                />
                <div>
                  <h1 className="text-lg md:text-xl font-medium mb-2">
                    {item.name}
                  </h1>
                  <p className="text-[#2A254B] text-[14px] mb-2">
                    {item.description}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                  <p className="text-sm">Quantity: {item.quantity || 1}</p>

                  {/* Gray Line Divider after Quantity */}
                  <div className="border-b border-gray-300 w-full my-4"></div>
                </div>
              </div>
              <p className="text-lg font-semibold">
                £{item.price}x{item.quantity || 1}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Your cart is empty.</p>
        )}
      </div>

      <hr className="w-full border-b-2 border-[#EBE8F4] mb-6" />

      <div className="w-full bg-white border border-[#EBE8F4] p-6 md:p-8">
        <div className="flex flex-col items-end">
          <div className="text-right mb-4">
            <h1 className="font-normal text-[#4E4D93] text-[20px] mb-2">
              Subtotal
            </h1>
            <p className="text-black text-lg font-normal">£{subtotal}</p>
            <p className="text-sm text-[#4E4D93]">
              Taxes and shipping are calculated at checkout
            </p>
          </div>
          <Link href="/checkout">
            <button className="bg-[#2A254B] w-full md:w-[172px] h-[56px] text-white text-sm capitalize">
              Go to checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
