"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleLoginFlow = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError("Failed to check authentication status");
          setIsLoading(false);
          return;
        }

        if (session) {
          const device_id = searchParams.get("device_id");
          const redirect_url = searchParams.get("redirect_url");
          console.log('device_id: ', device_id);
          console.log('redirect_url: ', redirect_url);
          if (device_id) {
            const data = await fetch("/api/product/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ device_id }),
            });
            if (!data.ok) {
              const errorData = await data.json();
              console.error("Product registration error:", errorData);
              setError(
                errorData.message || "Failed to register product license"
              );
              setIsLoading(false);
              return;
            }
            const dataJson = await data.json();
            console.log("Product registered successfully:", dataJson);
            localStorage.setItem(
              "device_token",
              JSON.stringify(dataJson.device_token)
            );
            // Successfully registered, redirect to redirect page with redirect_url
            const redirectParams = new URLSearchParams();
            if (redirect_url) {
              redirectParams.append("redirect_url", redirect_url);
            }
            router.push(`/redirect?${redirectParams.toString()}`);
          } else {
            router.push("/dashboard");
          }
          return;
        }

        // User not logged in, show login form
        setIsLoading(false);
      } catch (error: any) {
        console.error("Login flow error:", error);
        setError(error.message || "An unexpected error occurred");
        setIsLoading(false);
      }
    };

    handleLoginFlow();
  }, []);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError("");

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

      if (!siteUrl) {
        throw new Error("Site URL not configured");
      }

      const device_id = searchParams.get("device_id") || "";
      const redirect_url = searchParams.get("redirect_url") || "";
      const redirectTo = `${siteUrl}/auth/client-callback?device_id=${device_id}&redirect_url=${encodeURIComponent(redirect_url)}`;

      console.log("Initiating OAuth with redirect:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("OAuth initiation error:", error);
        throw error;
      }

      console.log("OAuth initiated successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed");
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleGoogleLogin}
        disabled={isAuthenticating}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {isAuthenticating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
        ) : (
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {isAuthenticating ? "Signing in..." : "Continue with Google"}
      </button>

      <div className="text-center text-sm text-gray-600">
        By continuing, you agree to our{" "}
        <a href="/legal/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
