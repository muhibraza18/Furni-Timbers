"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "use-shopping-cart";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    bankDetails: "",
  });
  const { clearCart } = useShoppingCart();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
 
      clearCart(); // Clear the cart
      alert("Your order has been placed successfully!");
      router.push("/success");

  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-5">Checkout</h1>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-500">Name</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md focus:ring-purple-500"
              placeholder="Enter your full name"
            />
            <button
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-md"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-500">Email</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md focus:ring-purple-500"
              placeholder="Enter your email address"
            />
            <button
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-md"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-500">Phone</h2>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md focus:ring-purple-500"
              placeholder="Enter your phone number"
            />
            <button
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-md"
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-purple-500">Address</h2>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border rounded-md focus:ring-purple-500"
              placeholder="Enter your address"
            />
            <button
              className="mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-md"
              onClick={handleSubmit}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
