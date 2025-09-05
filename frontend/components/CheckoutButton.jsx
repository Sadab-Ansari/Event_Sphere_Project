"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
    });
    const data = await res.json();

    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md"
    >
      Pay $50
    </button>
  );
}
