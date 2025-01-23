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
      className="rounded-xl hover:bg-purple-400 text-lg font-semibold px-4 py-2 text-white bg-purple-500 "
    >
      Add to Cart
    </button>
  );
}










// "use client";
// import { useShoppingCart } from "use-shopping-cart";

// export interface ProductCart {
//   name: string;
//   description: string;
//   price: number;
//   image: any;
//   currency: string;
// }

// export default function AddToCart({
//   description,
//   name,
//   price,
//   image,
//   currency,
// }: ProductCart) {
//   const { addItem, handleCartClick } = useShoppingCart();
//   const product = {
//     name: name,
//     description: description,
//     price: price,
//     currency: currency,
//     image: image,
//     id: "ldada",
//   };

//   return (
//     <button
//       className="rounded-xl bg-red-400 hover:bg-red-300 text-lg font-semibold px-4 py-2 text-white"
//       onClick={() => {
//         addItem(product), handleCartClick();
//       }}
//     >
//       Add to Cart
//     </button>
//   );
// }
