"use client";

import { useEffect } from "react";
import { useShoppingCart } from "use-shopping-cart";
import Link from "next/link";
import { CheckCircle, Package, Home, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center border border-slate-200">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="text-white" size={48} />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          {/* Order Details */}
          <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-2xl border border-slate-200 mb-8">
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <Package size={24} />
              <p className="font-semibold">
                You&apos;ll receive an order confirmation email shortly
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
              <Home size={20} />
              Back to Home
            </Link>
            <Link href="/products" className="flex items-center justify-center gap-2 bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Need help? Contact us at{" "}
              <a href="mailto:support@furnitimbers.com" className="text-slate-900 font-semibold hover:underline">
                support@furnitimbers.com
              </a>
            </p>
          </div>
        </div>

        {/* Confetti Effect (Optional) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-20 w-3 h-3 bg-green-500 rounded-full animate-ping" />
          <div className="absolute top-40 right-32 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-100" />
          <div className="absolute bottom-40 left-32 w-2 h-2 bg-purple-500 rounded-full animate-ping delay-200" />
        </div>
      </div>
    </div>
  );
}