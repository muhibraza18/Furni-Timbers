"use client"
import { ReactNode } from "react";
import { CartProvider as USCProvider } from "use-shopping-cart";

export default function CartProvider({ children }: { children: ReactNode }) {
  return (
    <USCProvider
      mode="payment"
      cartMode="client-only"
      successUrl="https://localhost:3000/sucess"
      cancelUrl="https://localhost:3000/error"
      currency="USD"
      stripe={process.env.NEXT_PUBLIC_STRIPE_KEY as string}
      billingAddressCollection={true}
      shouldPersist={true}
      language="en-US"
    >
      {children}
    </USCProvider>
  );
}
