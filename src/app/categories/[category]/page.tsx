import { sanityClient } from "@/sanity/lib/client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  inventory?: number; // Optional if not always available
}

const page = async (props: PageProps) => {
  console.log(props);
  const query = `*[_type == "products" && category._ref == $categoryId]{
        _id,
        title,
        price,
        "imageUrl": image.asset->url,
        inventory
      }`;

  const items: Product[] = await sanityClient.fetch(query, {
    categoryId: props.params.category,
  });
 
  return (
    <main className="flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <div key={product._id} className="m-2 bg-slate-50 rounded-lg p-2">
            <Link href={`/products/${product._id}`}>
              <Image
                src={product.imageUrl}
                alt={product.title}
                width={233}
                height={233}
                className="rounded-xl"
              />
            </Link>
            <div className="text-xl pt-3">{product.title}</div>
            <div className="font-bold text-lg text-end">{product.price}$</div>
            <div className="text-lg font-semibold text-gray-800">
              <span className="text-lg font-semibold text-gray-700">
                Stock: 
              </span>
              <span> {product.inventory}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default page;

