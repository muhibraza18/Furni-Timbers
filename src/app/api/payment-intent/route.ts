import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: '2025-01-27.acacia'
});

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe key is not configured" },
      { status: 500 }
    );
  }

  try {
    const { amount } = await request.json();

    // Create PaymentIntent instead of Checkout Session
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}









// // app/api/create-checkout-session/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   typescript: true,
//   apiVersion: '2025-01-27.acacia'
// });

// export async function POST(request: NextRequest) {
//   if (!process.env.STRIPE_SECRET_KEY) {
//     return NextResponse.json(
//       { error: "Stripe key is not configured" },
//       { status: 500 }
//     );
//   }

//   try {
//     const { amount } = await request.json();

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'usd',
//           product_data: { name: 'Your Product' },
//           unit_amount: Math.round(amount * 100), // Convert dollars to cents
//         },
//         quantity: 1,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.BASE_URL}/cancel`,
//     });

//     return NextResponse.json({ sessionId: session.id });
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return NextResponse.json(
//         { error: err.message },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { error: "An unknown error occurred" },
//       { status: 500 }
//     );
//   }
// }
