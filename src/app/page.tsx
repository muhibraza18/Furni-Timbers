import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

// Updated Type to include description if available later
type Item = {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  inventory: number;
  description?: string; // Added if you need it later
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
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg.jpg"
            fill
            className="object-cover"
            alt="Hero Background"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <p className="text-sm md:text-base uppercase tracking-[0.2em] mb-4 font-medium text-stone-200">
            Premium Seating Collection
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6">
            Comfort Meets <br className="hidden md:block" /> Timeless Design
          </h1>
          <p className="text-lg md:text-xl text-stone-100 max-w-2xl mb-10 font-light">
            Discover the perfect chair to transform your living space.
          </p>
          <Link 
            href="#new-arrivals"
            className="px-8 py-4 bg-white text-stone-900 font-semibold tracking-wide rounded-sm hover:bg-stone-100 transition-colors duration-300"
          >
            SHOP NEW ARRIVALS
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS SECTION */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-stone-900 mb-4">
            New Arrivals
          </h2>
          <div className="w-16 h-1 bg-stone-800 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-lg overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/products/${item._id}`} className="block">
                {/* Image Container with Zoom Effect */}
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <Image
                    src={item.imageUrl}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    alt={item.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Quick Add / Badge Overlay */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-stone-800 rounded-full uppercase tracking-wide">
                      New
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-medium text-stone-900 leading-tight group-hover:text-stone-700 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-lg font-semibold text-stone-900">
                      ${item.price}
                    </span>
                  </div>
                  
                  {/* Stock Status Badge */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.inventory > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-stone-500">
                        {item.inventory > 0 ? `In Stock (${item.inventory})` : 'Out of Stock'}
                      </span>
                    </div>
                    <span className="text-stone-400 group-hover:translate-x-1 transition-transform">
                      <i className="fa-solid fa-arrow-right text-xs"></i>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-stone-900">
            Browse by Category
          </h2>
          <Link href="/categories" className="text-sm font-semibold underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900 transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category._id} 
              href={`/categories/${category._id}`}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-md"
            >
              {/* Category Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.imageUrl}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  alt={category.title}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Category Title */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="font-serif text-3xl md:text-4xl font-medium mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {category.title}
                </h3>
                <span className="w-12 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}









// import { sanityClient } from "@/sanity/lib/client";
// import Image from "next/image";
// import Link from "next/link";

// type Item = {
//   _id: string;
//   title: string;
//   price: number;
//   imageUrl: string;
//   inventory: number;
// };

// type Category = {
//   _id: string;
//   title: string;
//   imageUrl: string;
// };

// export default async function Home() {
//   const query = `*[_type == "products"]{
//     price, "imageUrl": image.asset->url, tags, inventory, title, description, _id, category
//   }[0..7]`;
//   const items: Item[] = await sanityClient.fetch(query);

//   const queries = `*[_type == "categories"]{
//     "imageUrl": image.asset->url, _id, title
//   }`;
//   const categories: Category[] = await sanityClient.fetch(queries);

//   return (
//     <div className="flex justify-center items-center p-2">
//       <div>
//         <section className="relative w-full h-[500px] overflow-hidden">
//           <Image
//             src="/bg.jpg"
//             layout="fill"
//             objectFit="cover"
//             className="absolute inset-0 opacity-70"
//             alt="Background Image"
//           />
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
//             <h1 className="text-4xl md:text-6xl font-bold">
//               Welcome to Chair Haven
//             </h1>
//             <p className="mt-4 text-lg md:text-2xl">
//               Discover the perfect chair for your space
//             </p>
//           </div>
//         </section>

//         <section className="sec1">
//           <div className="text-4xl font-semibold m-3">New Arrivals</div>
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center items-center">
//             {items.map((item) => (
//               <div
//                 key={item._id}
//                 className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105"
//               >
//                 <Link href={`/products/${item._id}`}>
//                   <Image
//                     src={item.imageUrl}
//                     width={233}
//                     height={233}
//                     alt={item.title}
//                     className="rounded-xl w-full h-auto"
//                   />
//                 </Link>
//                 <div className="text-xl pt-3 font-semibold">{item.title}</div>
//                 <div className="font-bold text-lg text-end">{item.price}$</div>
//                 <div className="text-lg font-semibold text-black">
//                   <span>Stock:</span> <span>{item.inventory}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="sec2">
//           <div className="text-5xl sm:text-4xl font-semibold m-3 mt-10">
//             Categories
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {categories.map((category) => (
//               <Link key={category._id} href={`/categories/${category._id}`}>
//                 <div className="m-2 bg-white rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105">
//                   <Image
//                     src={category.imageUrl}
//                     width={333}
//                     height={333}
//                     alt={category.title}
//                     className="rounded-xl w-full h-auto "
//                   />
//                   <div className="text-xl pt-3 font-semibold">
//                     {category.title}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }
