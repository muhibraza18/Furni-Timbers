"use client";

import convertToSubCurrency from "../lib/ConvertToSubCurrency";
import CheckoutPage from "./Checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

const StripePayment = ({ amount = 0 }: { amount?: number }) => { // Provide a default value
  // Debugging: Log the amount
  console.log("StripePayment Amount:", amount);

  // Ensure amount is greater than 0
  if (amount <= 0) {
    return <div className="text-red-500">Invalid amount for payment.</div>;
  }

  return (
    <div>
      <h1 className="text-6xl font-bold text-center">
        Total Amount: ${amount.toFixed(2)}
      </h1>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubCurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  );
};

export default StripePayment;
