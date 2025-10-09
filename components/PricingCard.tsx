"use client";

import { getSession } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
}

export default function PricingCard({
  name,
  price,
  period,
  features,
}: PricingCardProps) {
  const isPro = name === "Pro";
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string>("");

  const loadRazorpayAndOpen = (
    subscriptionId: string,
    sessionToken: string
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("=== RAZORPAY SCRIPT LOADING ===");
      console.log("Subscription ID for checkout:", subscriptionId);

      if (window.Razorpay) {
        console.log("✅ Razorpay already loaded");
        openRazorpayCheckout(subscriptionId, sessionToken);
        resolve();
        return;
      }

      console.log("📥 Loading Razorpay script from CDN...");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        console.log("Razorpay available:", !!window.Razorpay);

        if (window.Razorpay) {
          console.log("✅ Razorpay object found, opening checkout");
          openRazorpayCheckout(subscriptionId, sessionToken);
          resolve();
        } else {
          console.error("❌ Razorpay object not available after script load");
          reject(new Error("Razorpay not available after script load"));
        }
      };

      script.onerror = (error) => {
        console.error("❌ Failed to load Razorpay script");
        console.error("Script error:", error);
        reject(new Error("Failed to load Razorpay script"));
      };

      console.log("📤 Appending script to document head...");
      document.head.appendChild(script);
    });
  };

  const openRazorpayCheckout = (
    subscriptionId: string,
    sessionToken: string
  ) => {
    console.log("=== OPENING RAZORPAY CHECKOUT ===");
    console.log("Subscription ID:", subscriptionId);

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

    if (!razorpayKeyId) {
      console.error("❌ Missing Razorpay key ID in openRazorpayCheckout");
      setIsProcessing(false);
      return;
    }

    try {
      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "Glimp",
        description: "Pro Monthly Subscription",
        theme: {
          color: "#3B82F6",
        },
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/billing/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionToken}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            console.log("Verification response status:", verifyResponse.status);

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              console.log("✅ Payment verification result:", verifyData);
              if (verifyData.ok) {
                console.log("🎉 Payment successful! Redirecting...");
                // Payment successful - open launch page in new tab
                // window.open(`/app/launch?nonce=${nonce}`, "_blank");

                // Redirect to profile page using window.location
                router.push("/dashboard");
              } else {
                console.error("❌ Payment verification failed:", verifyData);
                throw new Error("Payment verification failed");
              }
            } else {
              const errorText = await verifyResponse.text();
              console.error(
                "❌ Payment verification request failed:",
                verifyResponse.status,
                errorText
              );
              throw new Error("Payment verification request failed");
            }
          } catch (error) {
            console.error("❌ Payment verification error:", error);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User cancelled checkout
            console.log("❌ Payment modal dismissed by user");
            setIsProcessing(false);
          },
        },
      };

      console.log("🏗️ Creating Razorpay instance...");
      console.log("Options summary:", {
        key: options.key.substring(0, 10) + "...",
        subscription_id: options.subscription_id,
        name: options.name,
        description: options.description,
        theme: options.theme,
      });

      const rzp = new window.Razorpay(options);
      console.log("✅ Razorpay instance created successfully");

      console.log("🚀 Opening Razorpay checkout modal...");
      rzp.open();
      console.log("✅ Razorpay modal opened");
    } catch (error) {
      console.error("❌ Error creating/opening Razorpay checkout:", error);
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!isPro) router.push("/support");
    try {
      const session = await getSession();
      if (!session) {
        router.push("/login");
        return;
      } else {
        let currentSubscriptionId = subscriptionId;
        if (!currentSubscriptionId) {
          const response = await fetch("/api/billing/create-checkout-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Failed to create checkout session: ${response.status} - ${errorText}`
            );
          }
          const responseData = await response.json();
          console.log("Subscription API response data:", responseData);

          if (!responseData.subscription_id) {
            console.error("=== NO SUBSCRIPTION ID IN RESPONSE ===");
            console.error("Response data:", responseData);
            throw new Error("No subscription ID received from server");
          }

          currentSubscriptionId = responseData.subscription_id;
          console.log("=== NEW SUBSCRIPTION CREATED ===");
          console.log("Subscription ID:", currentSubscriptionId);
          setSubscriptionId(currentSubscriptionId);
        }
        const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKeyId) {
          throw new Error("Razorpay key not configured");
        }
        await loadRazorpayAndOpen(currentSubscriptionId, session.access_token);
      }
    } catch (error) {
      console.error(
        "Error message:",
        error instanceof Error ? error.message : "Unknown error"
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`rounded-lg p-6 ${
        isPro
          ? "bg-primary-50 border-2 border-primary-200"
          : "bg-white border border-gray-200"
      }`}
    >
      {isPro && (
        <div className="text-center">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600">/{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
          isPro
            ? "bg-primary-600 text-white hover:bg-primary-700"
            : name === "Enterprise"
            ? "bg-gray-800 text-white hover:bg-gray-900"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        onClick={handlePayment}
      >
        {isPro ? "Get Started" + (isProcessing ? "..." : "") : "Contact Sales"}
      </button>
    </div>
  );
}
