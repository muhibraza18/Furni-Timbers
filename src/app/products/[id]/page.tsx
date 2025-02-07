import { sanityClient } from "@/sanity/lib/client";
import React from "react";
import Image from "next/image";
import AddToCart from "@/app/components/AddToCart";
import Link from "next/link";
import SaveButton from "@/app/components/SaveButton";

// Define interfaces for our data structures
interface Product {
  _id: string;
  price: number;
  imageUrl: string;
  tags: string[];
  inventory: number;
  title: string;
  description: string;
  category: string;
}

interface RelatedProduct {
  _id: string;
  price: number;
  imageUrl: string;
  title: string;
}

const Page = async ({ params }: { params: { id: string } }) => {
  const query = `*[_type == "products" && _id == $id][0]{
    price,"imageUrl": image.asset->url,
    tags,inventory,title,description,_id,category
  }`;

  const items = await sanityClient.fetch<Product>(query, { id: params.id });

  if (!items) {
    console.error("Item not found");
    return null; // Handle item not found case
  }

  // Fetch related products based on tags
  const relatedProductsQuery = `*[_type == "products" && $tags in tags[] && _id != $id]{
    price, "imageUrl": image.asset->url, title, _id
  }`;

  const relatedProducts = await sanityClient.fetch<RelatedProduct[]>(relatedProductsQuery, {
    tags: items.tags[0], // Assuming you want to fetch related products based on the first tag
    id: params.id,
  });

  return (
    <main className="flex justify-center items-center flex-col p-6">
      <section className="flex flex-col lg:flex-row justify-center items-center gap-10 w-full max-w-7xl">
        <div className="mt-16">
          <Image
            src={items.imageUrl}
            width={444}
            height={444}
            alt={items.title}
            className="rounded-2xl shadow-lg"
          />
        </div>
        <div className="w-full lg:w-[30vw]">
          <h1 className="text-4xl font-semibold mt-5 text-gray-900">{items.title}</h1>
          <div className="mt-4 bg-gray-800 rounded-3xl text-lg w-[25vw] sm:w-[12vw] lg:w-[6vw] p-2 text-white font-bold">
            ${items.price} USD
          </div>
          <div className="mt-4 text-xl text-gray-800">{items.description}</div>
          <div className="mt-4 text-xl text-gray-800">
            Status: {items.inventory > 0 ? "In stock" : "Unavailable"}
          </div>
          <div className="gap-6 flex m-5">
            <AddToCart
              description={items.description}
              name={items.title}
              price={items.price}
              image={items.imageUrl}
              currency="USD"
              sku={items._id}
            />
            <SaveButton item={items} />
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="mt-10 w-full max-w-7xl flex flex-col items-center">
        <h2 className="text-4xl font-semibold mb-5 text-gray-900">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedProducts.map((relatedItem) => (
            <div
              key={relatedItem._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col"
            >
              <Image
                src={relatedItem.imageUrl}
                width={300}
                height={300}
                alt={relatedItem.title}
                className="rounded-lg mb-3"
              />
              <h3 className="text-xl font-semibold text-gray-900">{relatedItem.title}</h3>
              <p className="text-lg font-bold text-end text-gray-800">${relatedItem.price}</p>
              <Link href={`/products/${relatedItem._id}`}>
                <button className="mt-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-1 px-3 rounded w-full">
                  View Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;