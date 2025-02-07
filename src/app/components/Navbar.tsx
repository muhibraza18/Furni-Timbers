"use client";

import React from "react";
import Link from "next/link";
import { useShoppingCart } from "use-shopping-cart";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { handleCartClick } = useShoppingCart();
  const { user, isSignedIn } = useUser();

  return (
    <div>
      <div className="flex justify-around items-center gap-10 p-2 h-20 bg-gray-200">
        <Link href="/">
          <div className="text-2xl sm:text-4xl font-semibold text-black font-mono hover:cursor-pointer">
            Furni Timbers
          </div>
        </Link>

        <div className="flex items-center gap-3"></div>

        <div className="flex justify-center items-center gap-3">
          <button
            className="rounded-md p-1 sm:p-2 text-xl px-3 sm:px-5 hover:cursor-pointer hover:bg-gray-100 font-semibold flex w-28 gap-2 items-center justify-center bg-white border"
            onClick={() => handleCartClick()}
          >
            <span className="text-white">
              <Image src="/cart.png" height={30} width={30} alt="Image"></Image>
            </span>
            cart
          </button>

          <button className="rounded-md p-1 sm:p-2 text-xl px-3 sm:px-5 hover:cursor-pointerfont-semibold flex items-center justify-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </button>
        </div>
      </div>

      <nav className="flex justify-center items-center border h-14 p-2 text-gray-600">
        <ul className="flex gap-12 text-sm sm:text-lg font-semibold">
          <Link href="/">
            <li className="hover:cursor-pointer hover:text-gray-700">Home</li>
          </Link>
          <Link href="/products">
            <li className="hover:cursor-pointer hover:text-gray-700">
              All Product
            </li>
          </Link>
          <Link href="/search">
            <div className="font-semibol hover:text-gray-800">Search</div>
          </Link>
          <Link href="/profile">
            <li className="hover:cursor-pointer hover:text-gray-700">
              Profile
            </li>
          </Link>
          {/* Conditionally show Admin link */}
          {isSignedIn && user?.emailAddresses[0]?.emailAddress === "muhibraza04@gmail.com" && (
            <Link href="/admin">
              <li className="hover:cursor-pointer hover:text-gray-700">Admin</li>
            </Link>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
 