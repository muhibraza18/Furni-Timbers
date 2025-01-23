import { client } from "@/sanity/lib/client";
import Image from "next/image";
import React from "react";
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

const ProductListing = async () => {
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

  const res: Product[] = await client.fetch(query);

  return (
    <div className="flex justify-center items-center p-3">
      <div>
        <div className="text-4xl font-semibold m-2">Products</div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {res.map((product) => (
            <div
              key={product._id} // Corrected: Added `key` here for the parent div
              className="m-2 bg-slate-50 rounded-lg p-2 w-[80vw] md:w-auto"
            >
              <Link href={`/products/${product._id}`}>
                <Image
                  src={product.imageUrl}
                  width={233}
                  height={233}
                  alt={product.title}
                  className="rounded-xl w-[80vw]"
                />
              </Link>
              <div className="text-xl pt-3">{product.title}</div>
              <div className="font-bold text-lg text-end">{product.price}$</div>
              <div className="text-lg font-semibold text-red-400">
                <span className="text-lg font-semibold text-red-400">
                  Stock:
                </span>
                <span>{product.inventory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

