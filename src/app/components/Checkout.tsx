"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubCurrency from "../lib/ConvertToSubCurrency";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setError] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [URL, setURL] = useState("");

  useEffect(() => {
    // Access window only in the client
    if (typeof window !== "undefined") {
      console.log(window.location.host);
      const myhost = window.location.host;

      if (myhost === "localhost:3000") {
        setURL("http://localhost:3000");
      } else {
        setURL("https://stripe-payment-one-nu.vercel.app");
      }
    }
  }, []);

  useEffect(() => {
    fetch("/api/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create payment intent");
        }
        return res.json();
      })
      .then((data) => setClientSecret(data.clientSecret))
      .catch((error) => setError(error.message));
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Error handling
    if (!stripe || !elements || !clientSecret) {
      setError("Stripe.js has not yet loaded.");
      setLoading(false);
      return;
    }

    // Call elements.submit() to validate the form
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    // If there are no errors, proceed to confirm the payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${URL}/success`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      // Handle successful payment here (e.g., redirect or show a success message)
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      {clientSecret && <PaymentElement />}
      <button
        className="w-full bg-black text-white py-2 mt-5"
        disabled={loading}
        // onClick={clearCart()}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </form>
  );
};

export default CheckoutPage;
