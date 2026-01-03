"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Trash2, Heart, Package, User } from "lucide-react";

interface SavedItem {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
}

const Profile: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const items =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("savedItems") || "[]")
        : [];
    setSavedItems(items);
  }, []);

  const removeItem = (id: string) => {
    const updatedItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedItems));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- User Profile Header --- */}
        {isLoaded && user && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Image
                src={user.imageUrl}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-gray-100 shadow-sm"
              />
              <div className="absolute bottom-1 right-1 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white">
                <User size={16} />
              </div>
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="flex gap-4 mt-4 justify-center sm:justify-start text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1">
                  <Package size={16} />
                  <span>{savedItems.length} Saved Items</span>
                </div>
              </div>
            </div>
            <Link href="/">
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                Back to Shop
              </button>
            </Link>
          </div>
        )}

        {/* --- Tab / Title Section --- */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="text-gray-900 fill-gray-900" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Saved Items</h2>
          </div>
          <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {savedItems.length} items
          </span>
        </div>

        {/* --- Content Area --- */}
        {savedItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t saved any items yet. Start browsing and add some to your favorites!
            </p>
            <Link href="/">
              <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                Start Browsing
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative"
              >
                {/* Image Area */}
                <div className="relative w-full h-64 overflow-hidden bg-gray-100">
                  <Link href={`/products/${item.id}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {/* Remove Overlay Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-white hover:scale-110 transition-all shadow-sm border border-gray-100"
                    title="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                  </div>
                  
                  <p className="text-xl font-bold text-gray-900 mb-4">
                    ${item.price}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link href={`/products/${item.id}`}>
                      <button className="w-full bg-white border-2 border-gray-900 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-md">
                        <span>View Item</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;












// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useUser } from "@clerk/nextjs";

// interface SavedItem {
//   id: string;
//   imageUrl: string;
//   title: string;
//   price: number;
// }

// const Profile: React.FC = () => {
//   const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
//   const { user } = useUser();

//   useEffect(() => {
//     const items =
//       typeof window !== "undefined"
//         ? JSON.parse(localStorage.getItem("savedItems") || "[]")
//         : [];
//     setSavedItems(items);
//   }, []);

//   const removeItem = (id: string) => {
//     const updatedItems = savedItems.filter((item) => item.id !== id);
//     setSavedItems(updatedItems);
//     localStorage.setItem("savedItems", JSON.stringify(updatedItems));
//   };

//   return (
//     <main className="flex justify-center items-center p-5">
//       <div className="w-full max-w-7xl">
//         {user && (
//           <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//             <div className="flex items-center space-x-4">
//               <Image
//                 src={user.imageUrl}
//                 alt="Profile Picture"
//                 width={80}
//                 height={80}
//                 className="rounded-full"
//               />
//               <div>
//                 <h1 className="text-2xl font-semibold">{user.fullName}</h1>
//                 <p className="text-gray-600">
//                   {user.primaryEmailAddress?.emailAddress}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         <h1 className="text-4xl font-semibold mb-5">Saved Items</h1>
//         {savedItems.length === 0 ? (
//           <p className="text-lg">No saved items found.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {savedItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
//               >
//                 <div className="flex flex-col items-center">
//                   <Image
//                     src={item.imageUrl}
//                     width={150}
//                     height={150}
//                     alt={item.title}
//                     className="rounded-lg mb-3"
//                   />
//                   <h2 className="text-xl font-semibold text-center">
//                     {item.title}
//                   </h2>
//                   <p className="text-lg font-bold">${item.price} USD</p>
//                 </div>

//                 <div className="flex justify-center gap-3 mt-4">
//                   <Link href={`/products/${item.id}`}>
//                     <button className="hover:bg-gray-200 text-black font-semibold py-1 px-3 rounded-xl border-2 border-gray-200">
//                       View Product
//                     </button>
//                   </Link>
//                   <button
//                     onClick={() => removeItem(item.id)}
//                     className="rounded-xl bg-black text-white font-semibold py-1 px-3"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default Profile;
