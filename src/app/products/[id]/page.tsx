import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import AddToCart from "@/app/components/AddToCart";
import SaveButton from "@/app/components/SaveButton";
import Link from "next/link";
import { Check, Package } from "lucide-react";

// Define interfaces
interface Product {
  _id: string;
  price: number;
  imageUrl: string;
  tags: string[];
  inventory: number;
  title: string;
  description: string;
  category?: string;
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

  const item = await sanityClient.fetch<Product>(query, { id: params.id });

  if (!item) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline mt-4 block">Return Home</Link>
        </div>
      </main>
    );
  }

  // Fetch related products based on the first tag
  const relatedProductsQuery = `*[_type == "products" && $tags in tags[] && _id != $id]{
    price, "imageUrl": image.asset->url, title, _id
  }`;

  const relatedProducts = await sanityClient.fetch<RelatedProduct[]>(relatedProductsQuery, {
    tags: item.tags[0], 
    id: params.id,
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gray-900">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold truncate">{item.title}</span>
        </div>

        {/* Main Product Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-6 md:p-10">
            
            {/* Left: Image */}
            <div className="relative bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center h-[400px] lg:h-[500px]">
              <Image
                src={item.imageUrl}
                width={800}
                height={800}
                alt={item.title}
                className="object-contain w-full h-full mix-blend-multiply"
                priority
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-slate-900">
                  ${item.price}
                </span>
                <span className="text-lg text-slate-500 line-through decoration-slate-400">
                  ${(item.price * 1.2).toFixed(0)} {/* Mock original price */}
                </span>
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {item.description || "No description available for this premium product."}
              </p>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                {item.inventory > 0 ? (
                  <>
                    <div className="bg-emerald-100 p-1 rounded-full">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-slate-700">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="bg-red-100 p-1 rounded-full">
                      <Package className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-semibold text-slate-700">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <AddToCart
                    description={item.description}
                    name={item.title}
                    price={item.price}
                    image={item.imageUrl}
                    currency="USD"
                    sku={item._id}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <SaveButton item={item} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Related Products</h2>
            <Link href="/products" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              View All
            </Link>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedItem) => (
                <div
                  key={relatedItem._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col"
                >
                  <div className="relative h-64 bg-slate-100 w-full overflow-hidden">
                    <Image
                      src={relatedItem.imageUrl}
                      width={500}
                      height={500}
                      alt={relatedItem.title}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      Similar to {item.title}
                    </p>
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xl font-bold text-slate-900">
                        ${relatedItem.price}
                      </span>
                      <Link href={`/products/${relatedItem._id}`}>
                        <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No related products found.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Page;