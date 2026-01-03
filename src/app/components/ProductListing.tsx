"use client";

import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Define the type for the product objects
interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  inventory?: number;
  tags?: string[];
  description?: string;
  category?: string;
}

const ProductListing: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [visible, setVisible] = useState<number>(12);
  const [loading, setLoading] = useState<boolean>(true);

  const showMoreItems = () => {
    setVisible((prevValue) => prevValue + 12);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "products"]{
        _id,
        title,
        price,
        "imageUrl": image.asset->url,
        inventory,
        tags,
        description,
        category
      }`;

      const data: Product[] = await sanityClient.fetch(query);
      setItems(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Explore our latest collection of premium items.
          </p>
        </div>

        {/* Loading State - Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
                <div className="w-full h-64 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.slice(0, visible).map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full h-64 overflow-hidden bg-slate-100 rounded-t-2xl">
                  <Link href={`/products/${product._id}`}>
                    <Image
                      src={product.imageUrl}
                      width={500}
                      height={500}
                      alt={product.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {/* Optional Tag Badge */}
                  {product.inventory && product.inventory > 0 ? (
                     <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                       In Stock
                     </span>
                  ) : (
                     <span className="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                       Out of Stock
                     </span>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  
                  {/* Category/Description snippet */}
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem]">
                    {product.description || "Premium quality product for your daily needs."}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    {/* Price */}
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium">Price</span>
                      <span className="text-xl font-bold text-slate-900">
                        ${product.price}
                      </span>
                    </div>
                    
                    {/* Action Button */}
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      View Item
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && items.length > visible && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={showMoreItems}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-slate-900 rounded-full overflow-hidden transition-all duration-300 hover:bg-slate-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
            >
              <span className="mr-2">Load More Products</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProductListing;







// "use client";

// import { sanityClient } from "@/sanity/lib/client";
// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";

// // Define the type for the product objects
// interface Product {
//   _id: string;
//   title: string;
//   price: number;
//   imageUrl: string;
//   inventory?: number; // Optional if not always available
//   tags?: string[];
//   description?: string;
//   category?: string;
// }

// const ProductListing: React.FC = () => {
//   const [items, setItems] = useState<Product[]>([]); // Specify the type for items
//   const [visible, setVisible] = useState<number>(12); // Specify the type for visible
//   const [loading, setLoading] = useState<boolean>(true); // Loading state

//   const showMoreItems = () => {
//     setVisible((preValue) => preValue + 12); // Return the new value
//   };

//   // Fetch products when the component mounts
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const query = `*[_type == "products"]{
//         _id,
//         title,
//         price,
//         "imageUrl": image.asset->url,
//         inventory,
//         tags,
//         description,
//         category
//       }`;

//       const data: Product[] = await sanityClient.fetch(query);
//       setItems(data); // Set the fetched data to items
//       setLoading(false); // Set loading to false after data is fetched
//     };

//     fetchProducts();
//   }, []); // Empty dependency array means this runs once when the component mounts

//   return (
//     <div className="flex justify-center items-center p-3">
//       <div className="w-full max-w-7xl"> {/* Added max width for better layout */}
//         <div className="text-4xl font-semibold m-2 text-black">Products</div>
//         {loading ? ( // Show loading state
//           <div className="text-center text-gray-700">Loading...</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {items.slice(0, visible).map((product) => (
//               <div
//                 key={product._id} // Corrected: Added `key` here for the parent div
//                 className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:shadow-lg"
//               >
//                 <Link href={`/products/${product._id}`}>
//                   <Image
//                     src={product.imageUrl}
//                     width={233}
//                     height={233}
//                     alt={product.title}
//                     className="rounded-xl w-full h-auto"
//                   />
//                 </Link>
//                 <div className="text-xl pt-3 text-gray-900">{product.title}</div>
//                 <div className="font-bold text-lg text-end text-gray-800">{product.price}$</div>
//                 <div className="text-lg font-semibold text-black">
//                   <span className="text-lg font-semibold">Stock:</span>
//                   <span className="text-gray-600"> {product.inventory}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//         <div className="flex justify-center"> {/* Center the button */}
//           <button
//             className="border-2 border-gray-300 text-center w-full max-w-md my-5 rounded-xl text-xl text-black hover:bg-gray-100 transition duration-300"
//             onClick={showMoreItems}
//           >
//             View More
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductListing;