import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  tags: string[];
}

export default async function Home() {
  const query = `*[_type == "products"]{
  price,"imageUrl": image.asset->url,tags,inventory,title,description,_id,category
  }[0..7]`;
  const items = await client.fetch(query);
  // console.log(items);

  const queries = `*[_type == "categories"]{
  "imageUrl": image.asset->url,_id,title
  }`;
  const categories = await client.fetch(queries);
  console.log(categories);
  
  return (
    <div className="flex justify-center items-center p-2">
      <div>
        <section className="sec1">
          <div className="text-4xl font-semibold m-3">New Arrivals</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center items-center">
            {items.map((item: any) => (
              <div className="m-2 ml-8 md:ml-0 w-[80vw] md:w-auto bg-slate-50 rounded-lg p-2">
                <Link href={ `/products/${item._id}`}>
                <Image
                  key={item._id}
                  src={item.imageUrl}
                  width={233}
                  height={233}
                  alt={item.title}
                  className="rounded-xl w-[80vw]"
                ></Image></Link>
                <div className="text-xl pt-3">{item.title}</div>
                <div className="font-bold text-lg text-end">{item.price}$</div>
                <div className="text-lg font-semibold text-purple-500">
                  <span className="text-lg font-semibold text-purple-500">
                    Stock:
                  </span>
                  <span className="">{item.inventory}</span>
                </div>
              </div>
            ))}
          </div>
        </section>


        <section className="sec2">
          <div className="text-5xl sm:text-4xl font-semibold m-3 mt-10">Categories</div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {categories.map((category: any) => (
              <Link key={category._id} href={`/categories/${category._id}`}>
              <div className="m-2 bg-slate-50 rounded-lg p-2 ml-8 md:ml-0 w-[80vw] md:w-auto">
                <Image
                  key={category._id}
                  src={category.imageUrl}
                  width={333}
                  height={333}
                  alt={category.title}
                  className="rounded-xl transform hover:scale-110 transition-transform duration-300 hover:cursor-pointer w-[80vw]"
                ></Image>
                <div className="text-xl pt-3 font-semibold">{category.title}</div>
              </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 
      
