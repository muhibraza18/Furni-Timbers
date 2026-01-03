"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useShoppingCart } from "use-shopping-cart";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react"; // Added Icons

const Navbar = () => {
  const { handleCartClick, cartCount = 0 } = useShoppingCart();
  const { user, isSignedIn } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200" 
        : "bg-white border-b border-transparent"
    }`}>
      
      {/* Top Bar: Logo & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Custom Logo Icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-slate-900 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-slate-900 p-2 rounded-lg text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-slate-900 leading-none group-hover:text-slate-700 transition-colors">
                Furni Timbers
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase mt-1">
                Premium Living
              </span>
            </div>
          </Link>

          {/* Right Side Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-4">
            
            {/* Cart Button */}
            <button
              onClick={() => handleCartClick()}
              className="relative flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="relative">
                <Image 
                  src="/cart.png" 
                  height={20} 
                  width={20} 
                  alt="Cart" 
                  className="filter brightness-0 invert"
                />
                {cartCount && cartCount > 0 && (
                  <div className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </div>
                )}
              </div>
              <span>Cart</span>
            </button>

            {/* Auth Section */}
            <div className="h-10 w-px bg-gray-200 mx-1"></div>

            <div className="flex items-center">
              <SignedOut>
                <div className="px-5 py-2.5 border border-slate-900 text-slate-900 rounded-full text-sm font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300 cursor-pointer shadow-sm">
                  <SignInButton mode="modal">
                    <span>Sign In</span>
                  </SignInButton>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Hamburger Button (Visible only on Mobile) */}
          <div className="flex sm:hidden items-center gap-4">
             {/* Mobile Cart */}
            <button
              onClick={() => handleCartClick()}
              className="relative p-2 rounded-full text-slate-900 hover:bg-gray-100"
            >
               <Image 
                  src="/cart.png" 
                  height={24} 
                  width={24} 
                  alt="Cart" 
                  className="filter brightness-0"
                />
                {cartCount && cartCount > 0 && (
                  <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </div>
                )}
            </button>

             {/* Mobile Auth */}
             <SignedOut>
               <div className="p-2 rounded-full text-slate-900 hover:bg-gray-100">
                 <SignInButton mode="modal">
                    <UserButton />
                 </SignInButton>
               </div>
             </SignedOut>
             <SignedIn>
                <UserButton afterSignOutUrl="/" />
             </SignedIn>

             <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <div className="hidden sm:block border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center items-center h-14">
            <ul className="flex items-center gap-2">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "All Products" },
                { href: "/search", label: "Search", icon: Search },
                { href: "/profile", label: "Profile" },
              ].map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <li 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        active 
                          ? "bg-slate-900 text-white shadow-md" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {item.icon && <item.icon size={16} className={active ? "text-white" : "text-slate-500"} />}
                      {item.label}
                    </li>
                  </Link>
                );
              })}

              {/* Admin Link */}
              {isSignedIn && user?.emailAddresses[0]?.emailAddress === "muhibraza04@gmail.com" && (
                <Link href="/admin">
                  <li 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive("/admin") 
                        ? "bg-red-600 text-white shadow-md" 
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    Admin
                  </li>
                </Link>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 absolute w-full left-0 top-20 shadow-xl animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "All Products" },
              { href: "/search", label: "Search" },
              { href: "/profile", label: "Profile" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(link.href) ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
             {isSignedIn && user?.emailAddresses[0]?.emailAddress === "muhibraza04@gmail.com" && (
               <Link
                 href="/admin"
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="block px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
               >
                 Admin
               </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;










// "use client";

// import React from "react";
// import Link from "next/link";
// import { useShoppingCart } from "use-shopping-cart";
// import Image from "next/image";
// import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

// const Navbar = () => {
//   const { handleCartClick } = useShoppingCart();
//   const { user, isSignedIn } = useUser();

//   return (
//     <div>
//       <div className="flex justify-around items-center gap-10 p-2 h-20 bg-gray-200">
//         <Link href="/">
//           <div className="text-2xl sm:text-4xl font-semibold text-black font-mono hover:cursor-pointer">
//             Furni Timbers
//           </div>
//         </Link>

//         <div className="flex items-center gap-3"></div>

//         <div className="flex justify-center items-center gap-3">
//           <button
//             className="rounded-md p-1 sm:p-2 text-xl px-3 sm:px-5 hover:cursor-pointer hover:bg-gray-100 font-semibold flex w-28 gap-2 items-center justify-center bg-white border"
//             onClick={() => handleCartClick()}
//           >
//             <span className="text-white">
//               <Image src="/cart.png" height={30} width={30} alt="Image"></Image>
//             </span>
//             cart
//           </button>

//           <button className="rounded-md p-1 sm:p-2 text-xl px-3 sm:px-5 hover:cursor-pointerfont-semibold flex items-center justify-center">
//             <SignedOut>
//               <SignInButton />
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </button>
//         </div>
//       </div>

//       <nav className="flex justify-center items-center border h-14 p-2 text-gray-600">
//         <ul className="flex gap-12 text-sm sm:text-lg font-semibold">
//           <Link href="/">
//             <li className="hover:cursor-pointer hover:text-gray-700">Home</li>
//           </Link>
//           <Link href="/products">
//             <li className="hover:cursor-pointer hover:text-gray-700">
//               All Product
//             </li>
//           </Link>
//           <Link href="/search">
//             <div className="font-semibol hover:text-gray-800">Search</div>
//           </Link>
//           <Link href="/profile">
//             <li className="hover:cursor-pointer hover:text-gray-700">
//               Profile
//             </li>
//           </Link>
//           {/* Conditionally show Admin link */}
//           {isSignedIn && user?.emailAddresses[0]?.emailAddress === "muhibraza04@gmail.com" && (
//             <Link href="/admin">
//               <li className="hover:cursor-pointer hover:text-gray-700">Admin</li>
//             </Link>
//           )}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;
 