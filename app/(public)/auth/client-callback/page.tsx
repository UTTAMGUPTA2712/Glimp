"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { handleDeviceRedirect } from "@/lib/redirect";

export default function ClientCallback() {
  const router = useRouter();
  const param = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing authentication...");
  const [error, setError] = useState("");

  const device_id = searchParams.get("device_id");
  const redirect_url = searchParams.get("redirect_url");
  const redirect = async (access_token: string) => {
    if (device_id && redirect_url) {
      const data = await fetch("/api/product/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ device_id }),
      });
      const dataJson = await data.json();
      if (!data.ok) {
        if (data.status === 403) {
          console.log(
            "No active subscription, redirecting to pricing",
            dataJson
          );
          handleDeviceRedirect(dataJson.device_token, redirect_url);
          setError("No active subscription found. Please subscribe to a plan.");
          router.push("/pricing?showMessage=true");
          return;
        }
        console.error("Product registration error:", dataJson);
        setError(dataJson.message || "Failed to register product license");
        return;
      }
      console.log("Product registered successfully:", dataJson);
      handleDeviceRedirect(dataJson.device_token, redirect_url);
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    console.log("Client callback - initializing", router);
    console.log("Client callback - current pathname", param);
    const handleAuthCallback = async () => {
      try {
        console.log("Client callback - processing URL fragment");

        // Check if we have tokens in the URL fragment
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const errorParam = hashParams.get("error");
        const errorDescription = hashParams.get("error_description");

        console.log("Hash params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          error: errorParam,
          errorDescription,
        });

        if (errorParam) {
          console.error(
            "OAuth error in fragment:",
            errorParam,
            errorDescription
          );
          setError(`Authentication failed: ${errorParam}`);
          return;
        }

        if (accessToken) {
          setStatus("Setting up session...");
          await fetch("/api/account/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // Set the session using the tokens from the URL fragment
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (sessionError) {
            console.error("Session setup error:", sessionError);
            setError("Failed to establish session");
            return;
          }

          console.log("Session established successfully:", {
            userId: data.user?.id,
            hasSession: !!data.session,
          });

          setStatus("Redirecting...");
          redirect(accessToken);
          return;
        }

        // Try to handle the callback using Supabase's built-in method
        setStatus("Checking authentication status...");
        const { data, error: authError } = await supabase.auth.getSession();
        if (authError) {
          console.error("Auth session error:", authError);
          setError("Authentication failed");
          return;
        }

        if (data.session) {
          redirect(data.session.access_token);
        }
      } catch (error) {
        console.error("Client callback error:", error);
        setError("Authentication processing failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Authentication Error
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (device_id) params.set("device_id", device_id);
                if (redirect_url) params.set("redirect_url", redirect_url);
                const query = params.toString();
                router.push(`/login${query ? `?${query}` : ""}`);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
