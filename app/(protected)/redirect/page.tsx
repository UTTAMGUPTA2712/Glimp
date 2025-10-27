"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const deviceToken = localStorage.getItem("device_token");
    if (deviceToken) {
      // Open App while sending this token to the app
      const params = new URLSearchParams();
      params.append("device_token", deviceToken);
      window.location.href = `glimpai://register_device?${params.toString()}`;
    }
  }, []);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-5 bg-slate-50 font-sans">
        <div className="w-[420px] max-w-full text-center p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <h2 className="m-0 text-lg font-semibold">
            Redirecting to Glimp AI app...
          </h2>
          <p className="mt-2 mb-0 text-sm text-gray-500"></p>
          We are trying to open the app and register your device. If nothing
          happens, use the buttons below.
          <div className="mt-4 flex justify-center gap-2.5">
            <button
              onClick={() => {
                const deviceToken = localStorage.getItem("device_token");
                const params = new URLSearchParams();
                if (deviceToken) params.append("device_token", deviceToken);
                window.location.href = `glimpai://register_device?${params.toString()}`;
              }}
              className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Open App
            </button>

            <a
              href="/dashboard"
              className="inline-block px-4 py-2 rounded-md border border-gray-200 bg-white text-slate-900 no-underline hover:bg-gray-50"
            >
              Back to dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
