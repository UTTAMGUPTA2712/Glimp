"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";

type EntitlementData = {
  entitled: boolean;
  plan: string | null;
  status: "active" | "inactive" | "trialing" | "cancelled" | "deleted" | null;
  current_period_end: string | null;
};

export default function PlanManagementCard() {
  const [planData, setPlanData] = useState<EntitlementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadPlanData() {
      try {
        setIsLoading(true);
        setError(null);

        const session = await getSession();
        const accessToken = session?.access_token;

        // TODO: Replace with your actual entitlement API call
        // const response = await fetch('/api/entitlement', {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // })
        // const data = await response.json()

        // For now, setting mock data - remove this in production
        if (mounted) {
          setPlanData({
            entitled: false,
            plan: null,
            status: "inactive",
            current_period_end: null,
          });
        }
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || "Failed to load plan data");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlanData();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-2">Plan & Billing</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <a href="/login" className="btn btn-primary">
          Login
        </a>
      </div>
    );
  }

  const isActive = planData?.status === "active";

  return (
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Plan & Billing</h2>

      {/* Plan Details */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-500">
            Current Plan
          </label>
          <p className="text-gray-900 mt-1 capitalize font-medium">
            {planData?.plan || "No active plan"}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Status</label>
          <div className="mt-1">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {planData?.status || "inactive"}
            </span>
          </div>
        </div>

        {planData?.current_period_end && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Next Renewal
            </label>
            <p className="text-gray-900 mt-1">{planData.current_period_end}</p>
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-500">Access</label>
          <div className="mt-1">
            <span
              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                planData?.entitled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {planData?.entitled ? "Entitled" : "Not Entitled"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {!isActive ? (
          <a
            href="/pricing"
            className="block w-full text-center bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Choose a Plan
          </a>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your subscription is active. Manage changes from your account
              settings.
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="/support"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
