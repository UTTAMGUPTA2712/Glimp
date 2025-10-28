"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ClientCallback() {
  const router = useRouter();
  const param = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing authentication...");
  const [error, setError] = useState("");

  const redirect = async (access_token: string) => {
    const device_id = searchParams.get("device_id");
    const redirect_url = searchParams.get("redirect_url");

    if (device_id) {
      const data = await fetch("/api/product/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ device_id }),
      });
      if (!data.ok) {
        const errorData = await data.json();
        console.error("Product registration error:", errorData);
        setError(errorData.message || "Failed to register product license");
        return;
      }
      const dataJson = await data.json();
      console.log("Product registered successfully:", dataJson);
      localStorage.setItem(
        "device_token",
        JSON.stringify(dataJson.device_token)
      );
      // Redirect to redirect page with redirect_url parameter
      const redirectParams = new URLSearchParams();
      if (redirect_url) {
        redirectParams.append("redirect_url", redirect_url);
      }
      router.push(`/redirect?${redirectParams.toString()}`);
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

  const handleRetry = () => {
    const nonce =
      sessionStorage.getItem("oauth_nonce") || "retry-" + Date.now();
    router.push(`/login?nonce=${nonce}`);
  };

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
              onClick={handleRetry}
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
