"use client";

import React from "react";

interface SavedItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
}

const SaveButton = ({ item }: { item: ProductItem }) => {
  const handleSave = () => {
    const savedItems: SavedItem[] = JSON.parse(
      localStorage.getItem("savedItems") || "[]"
    );
    
    const itemToSave: SavedItem = {
      id: item._id,
      title: item.title,
      price: item.price,
      imageUrl: item.imageUrl,
    };

    // Check if the item is already saved
    const isAlreadySaved = savedItems.some(
      (savedItem) => savedItem.id === itemToSave.id
    );
    
    if (!isAlreadySaved) {
      savedItems.push(itemToSave);
      localStorage.setItem("savedItems", JSON.stringify(savedItems));
      alert("Item saved!");
    } else {
      alert("Item is already saved!");
    }
  };

  return (
    <button
      className="rounded-xl bg-gray-800 hover:bg-gray-700 text-lg font-semibold px-2 lg:px-4 py-1 lg:py-2 text-white"
      onClick={handleSave}
    >
      Save
    </button>
  );
};

export default SaveButton;
