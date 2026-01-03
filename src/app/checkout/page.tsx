"use client";

import { useState } from "react";
import { useShoppingCart } from "use-shopping-cart";
import sanityClient from "@sanity/client";
import Image from "next/image";
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, ShoppingBag, CreditCard } from "lucide-react";
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
}

export default function CheckoutPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { totalPrice = 0, cartDetails } = useShoppingCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.email.trim().length > 0 && formData.email.includes("@");
      case 3:
        return formData.phone.trim().length > 0;
      case 4:
        return formData.address.trim().length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const items = Object.values(cartDetails ?? {}).map((item) => ({
      _ref: item.id,
      _type: "reference",
    }));

    try {
      await client.create({
        _type: "order",
        ...formData,
        totalPrice,
        items,
      });

      if (totalPrice > 0) {
        setStep(5);
      } else {
        alert("Your cart is empty. Please add items to your cart.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-600 text-lg">Complete your order in a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <div className={`flex items-center gap-2 transition-all ${step >= 1 ? "text-slate-900" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 1 ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
                <User size={20} />
              </div>
              <span className="hidden sm:inline font-semibold text-sm">Details</span>
            </div>
            
            <div className="flex-1 h-1 mx-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className={`flex items-center gap-2 transition-all ${step >= 5 ? "text-slate-900" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= 5 ? "bg-slate-900 text-white" : "bg-slate-200"}`}>
                <CreditCard size={20} />
              </div>
              <span className="hidden sm:inline font-semibold text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
              {/* Step 1: Name */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <User className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">What&apos;s your name?</h2>
                      <p className="text-slate-600 text-sm">We&apos;ll use this for your order confirmation</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <button
                    onClick={() => validateStep() && setStep(2)}
                    disabled={!validateStep()}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Step 2: Email */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Your email address</h2>
                      <p className="text-slate-600 text-sm">For order updates and receipts</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      onClick={() => validateStep() && setStep(3)}
                      disabled={!validateStep()}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Phone */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Phone number</h2>
                      <p className="text-slate-600 text-sm">In case we need to contact you</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      onClick={() => validateStep() && setStep(4)}
                      disabled={!validateStep()}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Address */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Shipping address</h2>
                      <p className="text-slate-600 text-sm">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Full Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400"
                      placeholder="123 Furniture St, Design City, DC 12345"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(3)}
                      className="flex items-center justify-center gap-2 bg-slate-200 text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!validateStep() || isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : (
                        <>
                          Proceed to Payment <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                      <CreditCard className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Payment</h2>
                      <p className="text-slate-600 text-sm">Secure payment powered by Stripe</p>
                    </div>
                  </div>

                  <StripePayment amount={totalPrice} />

                  <button
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-all"
                  >
                    <ArrowLeft size={18} /> Back to Address
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <ShoppingBag className="text-slate-900" size={24} />
                <h3 className="text-xl font-bold text-slate-900">Order Summary</h3>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                {cartDetails && Object.values(cartDetails).length > 0 ? (
                  Object.values(cartDetails).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Your cart is empty.
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-slate-900 pt-3 border-t border-dashed border-slate-300">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









// "use client";

// import { useState, useEffect } from "react";
// import { useShoppingCart } from "use-shopping-cart";
// import sanityClient from "@sanity/client";
// import StripePayment from "../components/StripePayment";

// const client = sanityClient({
//   projectId: "2eotbbs7",
//   dataset: "production",
//   useCdn: true,
//   token:
//     "sklUzbX4xjQf3A6ZQFwwKVsqTkdiPnnr993CMlvgWbTrmleiGKHmo3wPEJnqBFiHQoKo5E0saN3lKhxXxxCphgHBYWcK5PDurYGsWJ5UYzsPjjDBV2itvmLpW4L0RdwLEtOyauQaIWNRZCXuAzccsJ97oUoNMxntUrtYrz7n20YSnZ9qlCsn",
// });

// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   bankName: string;
//   bankDetails: string;
// }

// export default function CheckoutPage() {
//   const [step, setStep] = useState<number>(1);
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     bankName: "",
//     bankDetails: "",
//   });
//   const { totalPrice = 0, cartDetails } = useShoppingCart(); // Default to 0 if undefined

//   // Debugging: Log the total price
//   useEffect(() => {
//     console.log("Total Price:", totalPrice);
//   }, [totalPrice]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const items = Object.values(cartDetails ?? {}).map((item) => ({
//       _ref: item.id,
//     }));

//     try {
//       await client.create({
//         _type: "order",
//         ...formData,
//         totalPrice,
//         items,
//       });

//       // clearCart();
//     } catch (error) {
//       console.error("Error creating order:", error);
//       alert("There was an error placing your order. Please try again.");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center p-6">
//       <div className="container mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold mb-5 text-gray-900">Checkout</h1>
//         <h2 className="text-xl font-semibold text-black">
//           Total Amount: ${totalPrice.toFixed(2)}
//         </h2>

//         {step === 1 && (
//           <div>
//             <h2 className="text-xl font-semibold text-black">Name</h2>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
//               placeholder="Enter your full name"
//             />
//             <button
//               className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
//               onClick={() => setStep(2)}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div>
//             <h2 className="text-xl font-semibold text-black">Email</h2>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
//               placeholder="Enter your email address"
//             />
//             <button
//               className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
//               onClick={() => setStep(3)}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === 3 && (
//           <div>
//             <h2 className="text-xl font-semibold text-black">Phone</h2>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
//               placeholder="Enter your phone number"
//             />
//             <button
//               className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
//               onClick={() => setStep(4)}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === 4 && (
//           <div>
//             <h2 className="text-xl font-semibold text-black">Address</h2>
//             <input
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
//               placeholder="Enter your address"
//             />
//             <button
//               className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
//               onClick={async () => {
//                 // Submit order to Sanity
//                 await handleSubmit();
//                 // Check if totalPrice is greater than 0 before proceeding
//                 if (totalPrice > 0) {
//                   setStep(5); // Move to payment step
//                 } else {
//                   alert("Your cart is empty. Please add items to your cart.");
//                 }
//               }}
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {step === 5 && (
//           <div>
//             <h2 className="text-xl font-semibold text-black">Payment</h2>
//             <StripePayment amount={totalPrice} />
//             {/* Pass the total price to StripePayment */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
