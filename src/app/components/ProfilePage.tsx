"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

interface SavedItem {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
}

const Profile: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const items =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("savedItems") || "[]")
        : [];
    setSavedItems(items);
  }, []);

  const removeItem = (id: string) => {
    const updatedItems = savedItems.filter((item) => item.id !== id);
    setSavedItems(updatedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedItems));
  };

  return (
    <main className="flex justify-center items-center p-5">
      <div className="w-full max-w-7xl">
        {user && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              <Image
                src={user.imageUrl}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-semibold">{user.fullName}</h1>
                <p className="text-gray-600">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-semibold mb-5">Saved Items</h1>
        {savedItems.length === 0 ? (
          <p className="text-lg">No saved items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={item.imageUrl}
                    width={150}
                    height={150}
                    alt={item.title}
                    className="rounded-lg mb-3"
                  />
                  <h2 className="text-xl font-semibold text-center">
                    {item.title}
                  </h2>
                  <p className="text-lg font-bold">${item.price} USD</p>
                </div>

                <div className="flex justify-center gap-3 mt-4">
                  <Link href={`/products/${item.id}`}>
                    <button className="hover:bg-gray-200 text-black font-semibold py-1 px-3 rounded-xl border-2 border-gray-200">
                      View Product
                    </button>
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-xl bg-black text-white font-semibold py-1 px-3"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
