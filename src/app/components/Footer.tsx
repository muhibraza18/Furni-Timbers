import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <h2 className="text-2xl font-bold text-white tracking-tight group-hover:text-slate-400 transition-colors">
                Furni Timbers
              </h2>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Elevating your living spaces with handcrafted, premium furniture designed for comfort and style.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Icons */}
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
                  Search
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-white transition-colors" />
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm hover:underline">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm hover:underline">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors text-sm hover:underline">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-slate-600 transition-colors placeholder-slate-600"
                />
              </div>
              <button className="w-full bg-white text-slate-900 font-semibold text-sm py-3 rounded-lg hover:bg-slate-200 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Furni Timbers. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;










// import React from "react";
// import Link from "next/link";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-200 text-black py-6 mt-10">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row justify-between items-center">
//           <div className="text-4xl font-semibold mb-4 md:mb-0">
//             Furni Timbers
//           </div>
          
//           <div className="text-xl flex flex-col md:flex-row items-center">
//             <Link href="/profile" className="hover:text-gray-600 cursor-pointer mx-2">Profile</Link>
//             <Link href="/products" className="hover:text-gray-600 cursor-pointer mx-2">All Products</Link>
//             <Link href="/search" className="hover:text-gray-600 cursor-pointer mx-2">Search</Link>
//           </div>
//         </div>

//         <div className="font-semibold text-center mt-4">
//           2025 All Rights Reserved | Terms of Use
//           <span className="font-bold"> Furni Timbers</span>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;