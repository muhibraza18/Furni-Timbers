"use client";
import { useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  tags: string[];
  imageUrl: string;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return; // Skip empty searches
    setLoading(true);

    try {
      const query = `*[_type == "products" && $tags[0] in tags] {
       _id,
      title,
      tags,
      "imageUrl": image.asset->url
      }`;
      const params = { tags: [searchTerm] };
      // const params: Record<string, string> = { tag: searchTerm };

      const data = await client.fetch<Product[]>(query, params);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto flex gap-5 items-center justify-center">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
        />
        <button
          onClick={handleSearch}
          className="mt-2 px-3 py-2 border-[3px] hover:bg-slate-100 border-purple-500 font-bold rounded-3xl text-purple-500  text-lg"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="text-lg text-purple-600 text-center mt-5">Search example: gallery, instagram, featured</div>

      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <div className="flex justify-center items-center">

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {results.map((product) => (
              <div key={product._id} className="p-4 border rounded-lg w-[60vw] md:w-[25vw]">
                <Link href={`/products/${product._id}`}>
                <Image
                  src={product.imageUrl}
                  height={233}
                  width={233}
                  alt={product.title}
                  className="rounded-xl w-[80vw]"
                ></Image></Link>
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-500">
                  Tags: {product.tags.join(", ")}
                </p>
              </div>
            ))}

          </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
