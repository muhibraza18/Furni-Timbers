"use client";

import { useState, useEffect, useCallback } from "react";
import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  tags: string[];
  imageUrl: string;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const query = `*[_type == "products" && $tags[0] in tags] {
        _id,
        title,
        tags,
        "imageUrl": image.asset->url
      }`;
      const params = { tags: [searchTerm] };
      const data = await sanityClient.fetch<Product[]>(query, params);
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Debounce search function
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [handleSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto flex gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search here"
          value={searchTerm}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-lg"
        />
        {loading ? (
          <button
            className="mt-2 px-3 py-2 border-2 border-gray-600 font-bold rounded-3xl text-gray-600 bg-gray-100"
          >
            Loading
          </button>
        ) : (
          <button
            onClick={handleSearch}
            className="mt-2 px-3 py-2 border-2 border-gray-600 font-bold rounded-3xl text-gray-600 bg-gray-100 hover:bg-gray-300 transition duration-300"
          >
            Search
          </button>
        )}
      </div>
      <div className="text-lg text-black text-center mt-5">
        Search example: gallery, instagram, featured
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {results.map((product) => (
              <div
                key={product._id}
                className="p-4 border border-gray-300 rounded-lg w-full"
              >
                <Link href={`/products/${product._id}`}>
                  <Image
                    src={product.imageUrl}
                    height={233}
                    width={233}
                    alt={product.title}
                    className="rounded-xl w-full h-auto"
                  />
                </Link>
                <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-600">
                  Tags: {product.tags.join(", ")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
