"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "use-shopping-cart";

export default function ShoppingCartModal() {
  const {
    cartCount = 0,
    cartDetails,
    shouldDisplayCart,
    handleCartClick,
    removeItem,
    totalPrice,
  } = useShoppingCart();
  const router = useRouter();

  const handleCheckout = () => {
    handleCartClick(); // Close the cart modal
    router.push("/checkout"); // Navigate to the checkout page
  };

  return (
    <Sheet open={shouldDisplayCart} onOpenChange={() => handleCartClick()}>
      <SheetContent className="sm:max-w-lg w-[90vw] bg-gray-200">
        <SheetHeader>
          <SheetTitle className="text-black">Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="h-full flex flex-col justify-between">
          <div className="mt-8 flex-1 overflow-y-auto">
            <ul className="-my-6 divide-y divide-gray-300">
              {cartCount === 0 ? (
                <h1 className="py-6 text-center text-gray-700">Your cart is empty</h1>
              ) : (
                Object.values(cartDetails ?? {}).map((entry) => (
                  <li key={entry.id} className="flex py-6 items-center">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-300">
                      <Image
                        src={entry.image || "/placeholder.png"}
                        alt={entry.name || "Product image"}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{entry.name}</h3>
                        <p>${entry.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {entry.description}
                      </p>
                      <button
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                        onClick={() => removeItem(entry.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="mt-4 p-4 bg-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black">Total</h3>
            <p className="text-xl font-bold text-black">${totalPrice?.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 mb-5 text-white rounded-md"
          >
            Checkout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}