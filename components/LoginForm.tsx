"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function LoginForm() {
  // const [isLoading, setIsLoading] = useState(false)

  // const handleGoogleLogin = async () => {
  //   setIsLoading(true)
  //   // Simulate OAuth flow
  //   setTimeout(() => {
  //     // Generate mock nonce and redirect to app/start
  //     const nonce = 'mock-nonce-' + Date.now()
  //     window.location.href = `/app/start?nonce=${nonce}&code=mock-auth-code&state=mock-state`
  //   }, 1000)
  // }
  const searchParams = useSearchParams();
  const router = useRouter();
  const [nonce, setNonce] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleLoginFlow = async () => {
      try {
        // Get or generate nonce
        const nonceParam = searchParams.get("nonce");
        const currentNonce = nonceParam || uuidv4();
        setNonce(currentNonce);

        // Check if user is already logged in
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
          console.log(
            "User already logged in, checking subscription status..."
          );

          // Check entitlement status
          const entitlementResponse = await fetch("/api/license/entitlement", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          });

          if (entitlementResponse.ok) {
            const entitlementData = await entitlementResponse.json();
            console.log("Entitlement data:", entitlementData);

            if (entitlementData.entitled) {
              // User has active subscription - redirect to profile and open toolbar
              console.log(
                "User entitled, redirecting to profile and opening toolbar"
              );

              // Complete device flow if nonce is present
              if (currentNonce) {
                try {
                  await fetch("/api/device/complete", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ nonce: currentNonce }),
                  });
                } catch (deviceError) {
                  console.error("Device completion error:", deviceError);
                }
              }

              // Open toolbar in new tab
              window.open(`/app/launch?nonce=${currentNonce}`, "_blank");

              // Redirect to profile
              router.push("/profile");
              return;
            } else {
              // User not entitled - redirect to pricing
              console.log("User not entitled, redirecting to pricing");
              router.push(`/pricing?nonce=${currentNonce}`);
              return;
            }
          } else {
            console.error(
              "Failed to check entitlement:",
              entitlementResponse.status
            );
            // If entitlement check fails, redirect to pricing to be safe
            router.push(`/pricing?nonce=${currentNonce}`);
            return;
          }
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
  }, [searchParams, router]);

  const handleGoogleLogin = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    setError("");

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

      if (!siteUrl) {
        throw new Error("Site URL not configured");
      }

      // Store nonce in sessionStorage to preserve it across OAuth redirect
      if (typeof window !== "undefined") {
        sessionStorage.setItem("oauth_nonce", nonce);
      }

      const redirectTo = `${siteUrl}/auth/client-callback`;

      console.log("Initiating OAuth with redirect:", redirectTo);
      console.log("Nonce stored:", nonce);

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

// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import { supabase } from "@/lib/supabase";

// export default function Login() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [nonce, setNonce] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticating, setIsAuthenticating] = useState(false);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const handleLoginFlow = async () => {
//       try {
//         // Get or generate nonce
//         const nonceParam = searchParams.get("nonce");
//         const currentNonce = nonceParam || uuidv4();
//         setNonce(currentNonce);

//         // Check if user is already logged in
//         const {
//           data: { session },
//           error: sessionError,
//         } = await supabase.auth.getSession();

//         if (sessionError) {
//           console.error("Session error:", sessionError);
//           setError("Failed to check authentication status");
//           setIsLoading(false);
//           return;
//         }

//         if (session) {
//           console.log(
//             "User already logged in, checking subscription status..."
//           );

//           // Check entitlement status
//           const entitlementResponse = await fetch("/api/license/entitlement", {
//             headers: {
//               Authorization: `Bearer ${session.access_token}`,
//               "Content-Type": "application/json",
//             },
//           });

//           if (entitlementResponse.ok) {
//             const entitlementData = await entitlementResponse.json();
//             console.log("Entitlement data:", entitlementData);

//             if (entitlementData.entitled) {
//               // User has active subscription - redirect to profile and open toolbar
//               console.log(
//                 "User entitled, redirecting to profile and opening toolbar"
//               );

//               // Complete device flow if nonce is present
//               if (currentNonce) {
//                 try {
//                   await fetch("/api/device/complete", {
//                     method: "POST",
//                     headers: {
//                       "Content-Type": "application/json",
//                       Authorization: `Bearer ${session.access_token}`,
//                     },
//                     body: JSON.stringify({ nonce: currentNonce }),
//                   });
//                 } catch (deviceError) {
//                   console.error("Device completion error:", deviceError);
//                 }
//               }

//               // Open toolbar in new tab
//               window.open(`/app/launch?nonce=${currentNonce}`, "_blank");

//               // Redirect to profile
//               router.push("/profile");
//               return;
//             } else {
//               // User not entitled - redirect to pricing
//               console.log("User not entitled, redirecting to pricing");
//               router.push(`/pricing?nonce=${currentNonce}`);
//               return;
//             }
//           } else {
//             console.error(
//               "Failed to check entitlement:",
//               entitlementResponse.status
//             );
//             // If entitlement check fails, redirect to pricing to be safe
//             router.push(`/pricing?nonce=${currentNonce}`);
//             return;
//           }
//         }

//         // User not logged in, show login form
//         setIsLoading(false);
//       } catch (error: any) {
//         console.error("Login flow error:", error);
//         setError(error.message || "An unexpected error occurred");
//         setIsLoading(false);
//       }
//     };

//     handleLoginFlow();
//   }, [searchParams, router]);

//   const handleGoogleLogin = async () => {
//     if (isAuthenticating) return;

//     setIsAuthenticating(true);
//     setError("");

//     try {
//       const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

//       if (!siteUrl) {
//         throw new Error("Site URL not configured");
//       }

//       // Store nonce in sessionStorage to preserve it across OAuth redirect
//       if (typeof window !== "undefined") {
//         sessionStorage.setItem("oauth_nonce", nonce);
//       }

//       const redirectTo = `${siteUrl}/auth/client-callback`;

//       console.log("Initiating OAuth with redirect:", redirectTo);
//       console.log("Nonce stored:", nonce);

//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: redirectTo,
//           queryParams: {
//             access_type: "offline",
//             prompt: "consent",
//           },
//         },
//       });

//       if (error) {
//         console.error("OAuth initiation error:", error);
//         throw error;
//       }

//       console.log("OAuth initiated successfully");
//     } catch (error: any) {
//       console.error("Login error:", error);
//       setError(error.message || "Login failed");
//       setIsAuthenticating(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Checking authentication status...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900">Login to Glimp</h1>
//           <p className="mt-2 text-gray-600">
//             Continue with your Google account
//           </p>

//           {nonce && (
//             <p className="text-xs text-gray-400 mt-2">
//               Session: {nonce.substring(0, 8)}...
//             </p>
//           )}
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <p className="text-red-800 text-sm">{error}</p>
//           </div>
//         )}

//         <button
//           onClick={handleGoogleLogin}
//           disabled={isAuthenticating}
//           className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {isAuthenticating ? (
//             <>
//               <svg
//                 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                 ></path>
//               </svg>
//               Connecting to Google...
//             </>
//           ) : (
//             <>
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                 <path
//                   fill="currentColor"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="currentColor"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               Continue with Google
//             </>
//           )}
//         </button>

//         <div className="text-center">
//           <p className="text-sm text-gray-500">
//             By continuing, you agree to our{" "}
//             <a
//               href="/legal/terms"
//               className="text-blue-600 hover:text-blue-500"
//             >
//               Terms of Service
//             </a>{" "}
//             and{" "}
//             <a
//               href="/legal/privacy"
//               className="text-blue-600 hover:text-blue-500"
//             >
//               Privacy Policy
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
