"use client";

import { useState, useEffect, useCallback } from "react";
import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  price?: number;
  description?: string;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
      // Updated query to search in both title and tags for better UX
      const query = `*[_type == "products" && (title match $searchTerm || $searchTerm in tags)] {
        _id,
        title,
        tags,
        price,
        description,
        "imageUrl": image.asset->url
      }`;
      // Added * to searchTerm to allow partial matches (e.g., "gal" matches "gallery")
      const params = { searchTerm: `*${searchTerm}*` };
      
      const data = await sanityClient.fetch<Product[]>(query, params);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Debounce search function
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
            Search Products
          </h1>
          <p className="text-gray-500 text-lg">
            Find exactly what you are looking for by title or tag.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex items-center max-w-2xl mx-auto mb-10 focus-within:ring-2 focus-within:ring-gray-400 transition-all duration-300">
          <svg
            className="h-6 w-6 text-gray-400 ml-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Try searching 'Citrus Edge' or 'Library Stool Chair'..."
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-lg text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none focus:ring-0"
          />
          {loading && (
            <div className="mr-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {loading && searchTerm ? (
             // Loading Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-medium text-gray-500">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-64 overflow-hidden bg-gray-100 rounded-t-2xl">
                      <Link href={`/products/${product._id}`}>
                        <Image
                          src={product.imageUrl}
                          width={500}
                          height={500}
                          alt={product.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                         {product.price && (
                            <span className="text-xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                         )}
                         <Link
                           href={`/products/${product._id}`}
                           className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                         >
                           View Item
                         </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchTerm && !loading ? (
            // No Results State
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-2 text-gray-500">
                We couldn&apos;t find anything matching &quot;{searchTerm}&quot;. Try checking your spelling or searching for a different tag.
              </p>
            </div>
          ) : (
            // Initial Empty State
            <div className="text-center py-20 opacity-50">
               <p className="text-gray-500">Start typing to search...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}






// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { sanityClient } from "@/sanity/lib/client";
// import Image from "next/image";
// import Link from "next/link";

// type Product = {
//   _id: string;
//   title: string;
//   tags: string[];
//   imageUrl: string;
// };

// export default function SearchPage() {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [results, setResults] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSearch = useCallback(async () => {
//     if (!searchTerm.trim()) return;
//     setLoading(true);

//     try {
//       const query = `*[_type == "products" && $tags[0] in tags] {
//         _id,
//         title,
//         tags,
//         "imageUrl": image.asset->url
//       }`;
//       const params = { tags: [searchTerm] };
//       const data = await sanityClient.fetch<Product[]>(query, params);
//       setResults(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchTerm]);

//   // Debounce search function
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       handleSearch();
//     }, 300); // 300ms debounce

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [handleSearch]);

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div className="p-4">
//       <div className="max-w-md mx-auto flex gap-4 items-center justify-center">
//         <input
//           type="text"
//           placeholder="Search here"
//           value={searchTerm}
//           onChange={handleInputChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg"
//         />
//         {loading ? (
//           <button
//             className="mt-2 px-3 py-2 border-2 border-gray-600 font-bold rounded-3xl text-gray-600 bg-gray-100"
//           >
//             Loading
//           </button>
//         ) : (
//           <button
//             onClick={handleSearch}
//             className="mt-2 px-3 py-2 border-2 border-gray-600 font-bold rounded-3xl text-gray-600 bg-gray-100 hover:bg-gray-300 transition duration-300"
//           >
//             Search
//           </button>
//         )}
//       </div>
//       <div className="text-lg text-black text-center mt-5">
//         Search example: gallery, instagram, featured
//       </div>

//       <div className="mt-6">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : results.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {results.map((product) => (
//               <div
//                 key={product._id}
//                 className="p-4 border border-gray-300 rounded-lg w-full"
//               >
//                 <Link href={`/products/${product._id}`}>
//                   <Image
//                     src={product.imageUrl}
//                     height={233}
//                     width={233}
//                     alt={product.title}
//                     className="rounded-xl w-full h-auto"
//                   />
//                 </Link>
//                 <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
//                 <p className="text-sm text-gray-600">
//                   Tags: {product.tags.join(", ")}
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-center text-gray-500">No results found.</p>
//         )}
//       </div>
//     </div>
//   );
// }
