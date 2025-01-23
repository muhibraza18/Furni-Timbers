"use client";
import React from "react";
import Link from "next/link";
import { useShoppingCart } from "use-shopping-cart";

const Navbar = () => {
  const { handleCartClick } = useShoppingCart();
  return (
    <div>
      <div className="flex justify-around items-center gap-10 p-2 bg-purple-50">
        <Link href="/">
          <div className="text-3xl sm:text-5xl font-semibold text-purple-500 hover:cursor-pointer">
            Furni Timbers
          </div>
        </Link>

        <div className="flex items-center gap-3"></div>

        <button
          className="rounded-3xl bg-purple-500 text-white p-1 sm:p-2 text-xl px-3 sm:px-5 hover:cursor-pointer hover:bg-purple-400 font-semibold"
          onClick={() => handleCartClick()}
        >
          Cart
        </button>
      </div>

      <nav className="flex justify-center items-center bg-purple-500 text-white h-9 p-2">
        <ul className="flex gap-12 text-sm sm:text-lg font-semibold">
          <Link href="/">
            <li className="hover:cursor-pointer hover:text-slate-200">Home</li>
          </Link>
          <Link href="/products">
            <li className="hover:cursor-pointer hover:text-slate-200">All Product</li>
          </Link>
          <Link href="/search">
            <div className="font-semibold hover:text-slate-200">
              Search
            </div>
          </Link>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
