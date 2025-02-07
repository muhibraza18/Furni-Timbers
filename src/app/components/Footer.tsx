import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-4xl font-semibold mb-4 md:mb-0">
            Furni Timbers
          </div>
          
          <div className="text-xl flex flex-col md:flex-row items-center">
            <Link href="/profile" className="hover:text-gray-600 cursor-pointer mx-2">Profile</Link>
            <Link href="/products" className="hover:text-gray-600 cursor-pointer mx-2">All Products</Link>
            <Link href="/search" className="hover:text-gray-600 cursor-pointer mx-2">Search</Link>
          </div>
        </div>

        <div className="font-semibold text-center mt-4">
          2025 All Rights Reserved | Terms of Use
          <span className="font-bold"> Furni Timbers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;