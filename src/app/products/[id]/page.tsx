import { client } from "@/sanity/lib/client";
import React from "react";
import Image from "next/image";
import AddToCart from "@/app/components/AddToCart";

const page = async ({ params }: { params: { id: string } }) => {
  console.log(params);
  const query = `*[_type == "products" && _id == $id][0]{
    price,"imageUrl": image.asset->url,
    tags,inventory,title,description,_id,category
      }`;

  const items = await client.fetch(query, { id: params.id });
  //   console.log(items);

  if (items) {
    console.log("Fetched item:", items);
    // Render item details
  } else {
    console.error("Item not found");
  }

  return (
    <main className="flex justify-center items-center">
      <section className="inline-block lg:flex justify-center items-center gap-10 lg:w-auto w-[50vw]">
        <div className="mt-16">
          <Image
            src={items.imageUrl}
            width={444}
            height={444}
            alt={items.title}
            className="rounded-2xl"
          ></Image>
        </div>
        <div className="w-auto lg:w-[30vw]">
          <h1 className="text-4xl font-semibold mt-5">{items.title}</h1>
          <div className="mt-4 bg-purple-500 rounded-3xl text-lg w-[25vw] sm:w-[12vw] lg:w-[6vw] p-2 text-white font-bold">
            ${items.price} USD
          </div>
          <div className="mt-4 text-xl lg:text-base">{items.description}</div>
          <div className="mt-4 text-xl lg:text-base">
            Status: {items.inventory > 0 ? "Instock" : "Unavailable"}
          </div>
          <div className="gap-10 flex m-5">
            {/* <button className="rounded-xl bg-red-400 hover:bg-red-300 text-lg font-semibold px-4 py-2 text-white">
              Add to Cart
            </button> */}
            <AddToCart
              description={items.description}
              name={items.title}
              price={items.price}
              image={items.imageUrl}
              currency="USD"
              sku={items._id}
            />
            <button className="rounded-xl bg-purple-500 hover:bg-purple-400 text-lg font-semibold px-2 lg:px-4 py-1 lg:py-2 text-white">
              Save
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
