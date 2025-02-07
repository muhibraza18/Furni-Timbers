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
  inventory?: number; // Optional if not always available
  tags?: string[];
  description?: string;
  category?: string;
}

const ProductListing: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]); // Specify the type for items
  const [visible, setVisible] = useState<number>(12); // Specify the type for visible
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const showMoreItems = () => {
    setVisible((preValue) => preValue + 12); // Return the new value
  };

  // Fetch products when the component mounts
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
      setItems(data); // Set the fetched data to items
      setLoading(false); // Set loading to false after data is fetched
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="flex justify-center items-center p-3">
      <div className="w-full max-w-7xl"> {/* Added max width for better layout */}
        <div className="text-4xl font-semibold m-2 text-black">Products</div>
        {loading ? ( // Show loading state
          <div className="text-center text-gray-700">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.slice(0, visible).map((product) => (
              <div
                key={product._id} // Corrected: Added `key` here for the parent div
                className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:shadow-lg"
              >
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.imageUrl}
                    width={233}
                    height={233}
                    alt={product.title}
                    className="rounded-xl w-full h-auto"
                  />
                </Link>
                <div className="text-xl pt-3 text-gray-900">{product.title}</div>
                <div className="font-bold text-lg text-end text-gray-800">{product.price}$</div>
                <div className="text-lg font-semibold text-black">
                  <span className="text-lg font-semibold">Stock:</span>
                  <span className="text-gray-600"> {product.inventory}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center"> {/* Center the button */}
          <button
            className="border-2 border-gray-300 text-center w-full max-w-md my-5 rounded-xl text-xl text-black hover:bg-gray-100 transition duration-300"
            onClick={showMoreItems}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;