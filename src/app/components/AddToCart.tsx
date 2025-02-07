"use client";

import { useShoppingCart } from "use-shopping-cart";

export default function AddToCart({
  description,
  name,
  price,
  image,
  currency,
  sku,
}: {
  description: string;
  name: string;
  price: number;
  image: string;
  currency: string;
  sku: string; // sku is now required
}) {
  const { addItem, handleCartClick } = useShoppingCart();

  const handleAddToCart = () => {
    addItem({
      sku, // Pass the sku
      name,
      price,
      description,
      image,
      currency,
    });
    handleCartClick(); // Open the cart after adding the item
  };

  return (
    <button
      onClick={handleAddToCart}
      className="rounded-xl bg-gray-800 hover:bg-gray-700 text-lg font-semibold px-2 lg:px-4 py-1 lg:py-2 text-white"
    >
      Add to Cart
    </button>
  );
}
