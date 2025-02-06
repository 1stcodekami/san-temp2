// src/app/component/header.tsx
"use client";

import React, { useContext } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUserCircle, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import { CartContext } from "./CartContext";
import { Badge } from "../ui/badge"; // Ensure this path is correct

const Header = () => {
  const { cartItems } = useContext(CartContext);

  // Calculate the total quantity of items in the cart
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="relative max-w-full bg-[#FFFFFF] font-satoshi">
      {/* Header Section */}
      <header className="w-full h-[70px] flex items-center justify-between px-4 md:px-8 fixed top-0 left-0 z-50 shadow-md bg-white">
        {/* Left Section: Search Icon */}
        <div className="hidden md:block">
          <CiSearch size={24} className="text-gray-600 cursor-pointer" />
        </div>

        {/* Center Section: Brand Name */}
        <h1 className="text-lg md:text-xl font-normal text-black text-center font-[clash]">
          Avion
        </h1>

        {/* Right Section: Icons */}
        <div className="flex items-center space-x-4 relative">
          <CiSearch size={24} className="text-gray-600 cursor-pointer md:hidden" />
          <FaRegHeart size={22} />

          <Link href="/Cart" className="relative">
            <MdOutlineShoppingCart size={24} className="text-gray-600 cursor-pointer" />
            {totalQuantity > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {totalQuantity}
              </Badge>
            )}
          </Link>

          <FaRegUserCircle size={24} className="text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* Divider Line */}
      <hr className="w-full border-b-2 border-gray-300 mt-[70px]" />

      {/* Navigation Links */}
      <nav className="flex flex-wrap justify-center gap-4 lg:gap-8 py-4">
        <Link href="/" className="text-[#726E8D] hover:text-black transition-all py-2">
          Home
        </Link>
        <Link href="/About" className="text-[#726E8D] hover:text-black transition-all py-2">
          About
        </Link>
        <Link href="/products" className="text-[#726E8D] hover:text-black transition-all py-2">
          Products
        </Link>
      </nav>
    </div>
  );
};

export default Header;
