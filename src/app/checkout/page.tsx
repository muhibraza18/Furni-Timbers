"use client";

import { useState, useEffect } from "react";
import { useShoppingCart } from "use-shopping-cart";
import sanityClient from "@sanity/client";
import StripePayment from "../components/StripePayment";

const client = sanityClient({
  projectId: "2eotbbs7",
  dataset: "production",
  useCdn: true,
  token:
    "sklUzbX4xjQf3A6ZQFwwKVsqTkdiPnnr993CMlvgWbTrmleiGKHmo3wPEJnqBFiHQoKo5E0saN3lKhxXxxCphgHBYWcK5PDurYGsWJ5UYzsPjjDBV2itvmLpW4L0RdwLEtOyauQaIWNRZCXuAzccsJ97oUoNMxntUrtYrz7n20YSnZ9qlCsn",
});

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  bankDetails: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    bankDetails: "",
  });
  const { totalPrice = 0, cartDetails } = useShoppingCart(); // Default to 0 if undefined

  // Debugging: Log the total price
  useEffect(() => {
    console.log("Total Price:", totalPrice);
  }, [totalPrice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const items = Object.values(cartDetails ?? {}).map((item) => ({
      _ref: item.id,
    }));

    try {
      await client.create({
        _type: "order",
        ...formData,
        totalPrice,
        items,
      });

      // clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center p-6">
      <div className="container mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-5 text-gray-900">Checkout</h1>
        <h2 className="text-xl font-semibold text-black">
          Total Amount: ${totalPrice.toFixed(2)}
        </h2>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-black">Name</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your full name"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              onClick={() => setStep(2)}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-black">Email</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your email address"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              onClick={() => setStep(3)}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-black">Phone</h2>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your phone number"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              onClick={() => setStep(4)}
            >
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-black">Address</h2>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
              placeholder="Enter your address"
            />
            <button
              className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
              onClick={async () => {
                // Submit order to Sanity
                await handleSubmit();
                // Check if totalPrice is greater than 0 before proceeding
                if (totalPrice > 0) {
                  setStep(5); // Move to payment step
                } else {
                  alert("Your cart is empty. Please add items to your cart.");
                }
              }}
            >
              Next
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold text-black">Payment</h2>
            <StripePayment amount={totalPrice} />
            {/* Pass the total price to StripePayment */}
          </div>
        )}
      </div>
    </div>
  );
}
