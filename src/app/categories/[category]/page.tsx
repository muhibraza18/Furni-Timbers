import { sanityClient } from "@/sanity/lib/client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package } from "lucide-react";

// Define the type for the props parameter
interface PageProps {
  params: {
    category: string;
  };
}

// Define the type for the product objects
interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  inventory?: number;
  category?: {
    title?: string; // Assuming your category reference has a title field
  };
}

const Page = async (props: PageProps) => {
  // Assuming props.params.category is the Reference ID.
  // We pass it directly to the query.
  const categoryId = props.params.category;

  const query = `*[_type == "products" && category._ref == $categoryId]{
        _id,
        title,
        price,
        "imageUrl": image.asset->url,
        inventory,
        category
      }`;

  const items: Product[] = await sanityClient.fetch(query, { categoryId });

  // Helper to get a nice readable name if available, otherwise use the ID
  const categoryName = items.length > 0 && items[0].category?.title 
    ? items[0].category.title 
    : "Category";

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link href="/" className="hover:text-slate-900">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-slate-900">All Products</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold capitalize">{categoryName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {categoryName} Collection
          </h1>
          <p className="mt-2 text-slate-600">
            Explore {items.length} {items.length === 1 ? 'item' : 'items'} in this category.
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
             <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Package className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
             <p className="text-slate-500 mb-6">We couldn&apos;t find any products in this category.</p>
             <Link href="/" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors">
               Return Home
             </Link>
          </div>
        )}

        {/* Products Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full h-64 overflow-hidden bg-slate-100">
                  <Link href={`/products/${product._id}`}>
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {/* Inventory Badge */}
                  {typeof product.inventory === "number" && (
                     <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide ${
                        product.inventory > 0 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-red-100 text-red-700"
                     }`}>
                       {product.inventory > 0 ? "In Stock" : "Sold Out"}
                     </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-slate-600 transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xl font-bold text-slate-900">
                      ${product.price}
                    </span>
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-slate-900 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                      aria-label="View Details"
                    >
                      <ArrowRight size={18} />
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

export default Page;














// import { sanityClient } from "@/sanity/lib/client";
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";

// // Define the type for the props parameter
// interface PageProps {
//   params: {
//     category: string;
//   };
// }

// // Define the type for the product objects
// interface Product {
//   _id: string;
//   title: string;
//   price: number;
//   imageUrl: string;
//   inventory?: number; // Optional if not always available
// }

// const page = async (props: PageProps) => {
//   console.log(props);
//   const query = `*[_type == "products" && category._ref == $categoryId]{
//         _id,
//         title,
//         price,
//         "imageUrl": image.asset->url,
//         inventory
//       }`;

//   const items: Product[] = await sanityClient.fetch(query, {
//     categoryId: props.params.category,
//   });
 
//   return (
//     <main className="flex justify-center items-center">
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
//         {items.map((product) => (
//           <div key={product._id} className="m-2 bg-slate-50 rounded-lg p-2">
//             <Link href={`/products/${product._id}`}>
//               <Image
//                 src={product.imageUrl}
//                 alt={product.title}
//                 width={233}
//                 height={233}
//                 className="rounded-xl"
//               />
//             </Link>
//             <div className="text-xl pt-3">{product.title}</div>
//             <div className="font-bold text-lg text-end">{product.price}$</div>
//             <div className="text-lg font-semibold text-gray-800">
//               <span className="text-lg font-semibold text-gray-700">
//                 Stock: 
//               </span>
//               <span> {product.inventory}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// };

// export default page;

