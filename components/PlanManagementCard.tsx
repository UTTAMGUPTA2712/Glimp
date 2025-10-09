"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { Copy, Check } from "lucide-react";

type AccountData = {
  id: string;
  email: string | null;
  plan: string | null;
  status: "active" | "inactive" | "trialing" | "cancelled" | "deleted" | null;
  current_period_end: string | null;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  deleted_at: string | null;
  device_id: string | null;
};

export default function PlanManagementCard() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [copiedUserId, setCopiedUserId] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPlanData() {
      try {
        setIsLoading(true);
        setError(null);

        const session = await getSession();
        const accessToken = session?.access_token;

        const response = await fetch('/api/account', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json?.error || 'Failed to load account');
        }
        if (mounted) {
          setAccount(json?.data || null);
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

  // Loading handled via overlay on the card

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

  const isActive = account?.status === "active";

  async function onCancel() {
    try {
      setIsCancelling(true);
      setCancelMessage(null);
      const session = await getSession();
      const accessToken = session?.access_token;
      const res = await fetch('/api/billing/cancel', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || 'Cancellation failed');
      }
      setCancelMessage('Subscription cancelled');
      // Refresh account data after cancellation
      await new Promise((r) => setTimeout(r, 300));
      const refreshed = await fetch('/api/account', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const refreshedJson = await refreshed.json();
      if (refreshed.ok) {
        setAccount(refreshedJson?.data || null);
      }
    } catch (e: any) {
      setCancelMessage(e?.message || 'Cancellation failed');
    } finally {
      setIsCancelling(false);
    }
  }

  return (
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      {isLoading && (
        <div className="absolute inset-0 z-10 rounded-2xl bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div role="status" aria-live="polite" className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-primary-600 animate-spin" />
            <span className="text-sm text-gray-700">Loading…</span>
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Plan & Billing</h2>

      {/* Plan Details */}
      <div className={`space-y-4 mb-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div>
          <label className="text-sm font-medium text-gray-500">
            Current Plan
          </label>
          <p className="text-gray-900 mt-1 capitalize font-medium">
            {account?.plan || "No active plan"}
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
              {account?.status || "inactive"}
            </span>
          </div>
        </div>

        {account?.current_period_end && (
          <div>
            <label className="text-sm font-medium text-gray-500">
              Next Renewal
            </label>
            <p className="text-gray-900 mt-1">{account.current_period_end}</p>
          </div>
        )}

        {/* Additional account details */}
        <div>
          <label className="text-sm font-medium text-gray-500">User ID</label>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-gray-900 break-all">{account?.id}</p>
            {account?.id && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(account.id);
                    setCopiedUserId(true);
                    window.setTimeout(() => setCopiedUserId(false), 1200);
                  } catch {}
                }}
                className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 border border-gray-200 text-gray-700"
                aria-label="Copy User ID"
                title={copiedUserId ? "Copied" : "Copy"}
              >
                {copiedUserId ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-gray-900 mt-1">{account?.email || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Razorpay Customer ID</label>
          <p className="text-gray-900 mt-1 break-all">{account?.razorpay_customer_id || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Razorpay Subscription ID</label>
          <p className="text-gray-900 mt-1 break-all">{account?.razorpay_subscription_id || '-'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500">Device</label>
          <p className="text-gray-900 mt-1 break-all">{account?.device_id || '-'}</p>
        </div>
        {account?.deleted_at && (
          <div>
            <label className="text-sm font-medium text-gray-500">Deleted At</label>
            <p className="text-gray-900 mt-1">{account.deleted_at}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`space-y-3 pt-4 border-t border-gray-200 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        {!isActive ? (
          <a
            href="/pricing"
            className="block w-full text-center bg-primary-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Choose a Plan
          </a>
        ) : (
          <div className="space-y-3">
            {cancelMessage && (
              <div className="text-sm text-center text-gray-800">{cancelMessage}</div>
            )}
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className={`block w-full text-center ${isCancelling ? 'bg-gray-300' : 'bg-red-600 hover:bg-red-700'} text-white py-2.5 px-4 rounded-lg font-medium transition-colors`}
            >
              {isCancelling ? 'Cancelling…' : 'Cancel Subscription'}
            </button>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <a
              href="/support"
              className="text-primary-600 hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
