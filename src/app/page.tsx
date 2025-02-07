import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

type Item = {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  inventory: number;
};

type Category = {
  _id: string;
  title: string;
  imageUrl: string;
};

export default async function Home() {
  const query = `*[_type == "products"]{
    price, "imageUrl": image.asset->url, tags, inventory, title, description, _id, category
  }[0..7]`;
  const items: Item[] = await sanityClient.fetch(query);

  const queries = `*[_type == "categories"]{
    "imageUrl": image.asset->url, _id, title
  }`;
  const categories: Category[] = await sanityClient.fetch(queries);

  return (
    <div className="flex justify-center items-center p-2">
      <div>
        <section className="relative w-full h-[500px] overflow-hidden">
          <Image
            src="/bg.jpg"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 opacity-70"
            alt="Background Image"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to Chair Haven
            </h1>
            <p className="mt-4 text-lg md:text-2xl">
              Discover the perfect chair for your space
            </p>
          </div>
        </section>

        <section className="sec1">
          <div className="text-4xl font-semibold m-3">New Arrivals</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center">
            {items.map((item) => (
              <div
                key={item._id}
                className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105"
              >
                <Link href={`/products/${item._id}`}>
                  <Image
                    src={item.imageUrl}
                    width={233}
                    height={233}
                    alt={item.title}
                    className="rounded-xl w-full h-auto"
                  />
                </Link>
                <div className="text-xl pt-3 font-semibold">{item.title}</div>
                <div className="font-bold text-lg text-end">{item.price}$</div>
                <div className="text-lg font-semibold text-black">
                  <span>Stock:</span> <span>{item.inventory}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sec2">
          <div className="text-5xl sm:text-4xl font-semibold m-3 mt-10">
            Categories
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link key={category._id} href={`/categories/${category._id}`}>
                <div className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105">
                  <Image
                    src={category.imageUrl}
                    width={333}
                    height={333}
                    alt={category.title}
                    className="rounded-xl w-full h-auto "
                  />
                  <div className="text-xl pt-3 font-semibold">
                    {category.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
