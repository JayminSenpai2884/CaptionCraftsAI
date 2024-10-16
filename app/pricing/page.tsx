"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Updated pricing plans with revised descriptions and prices
const pricingPlans = [
  {
    name: "Basic",
    price: "7",
    priceId: "price_1QATExEYHRuiXBcV9DHNhpsX",
    features: [
      "50 AI-generated posts per month",
      "Twitter tweet generation",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "19",
    priceId: "price_1QATGLEYHRuiXBcV4yRvDQtR",
    features: [
      "250 AI-generated posts per month",
      "Content for Twitter, Instagram, and LinkedIn",
      "Advanced analytics",
      "Priority email support",
    ],
  },
  {
    name: "Enterprise",
    price: "99",
    priceId: "price_1QATGbEYHRuiXBcVavPz3rZk",
    features: [
      "Unlimited AI-generated posts",
      "All social media platforms",
      "Custom AI model training",
      "Dedicated account manager",
      "24/7 support",
    ],
  },
];

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (!stripe) {
        throw new Error("Failed to load Stripe");
      }
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar />
      <main className="container mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold mb-12 text-center text-gray-800">
          Pricing Plans
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="p-8 rounded-lg border border-gray-300 bg-white flex flex-col shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {plan.name}
              </h2>
              <p className="text-4xl font-bold mb-6 text-gray-800">
                ${plan.price}
                <span className="text-lg font-normal text-gray-500">
                  /month
                </span>
              </p>
              <ul className="mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center mb-3 text-gray-600"
                  >
                    <CheckIcon className="w-5 h-5 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                disabled={isLoading || !plan.priceId}
                className="w-full bg-gray-800 text-white hover:bg-gray-700"
              >
                {isLoading ? "Processing..." : "Choose Plan"}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
