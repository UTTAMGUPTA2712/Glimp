"use client";
import React, { useState, useEffect } from "react";
import { Key, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getSession } from "@/lib/auth";

export default function ProductRegistration() {
  const [uuid, setUuid] = useState("");
  const [userId] = useState("user123"); // Replace with actual user ID from auth
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUuid, setRegisteredUuid] = useState("");

  useEffect(() => {
    checkRegistration();
  }, []);

  const checkRegistration = async () => {
    try {
      const session = await getSession();
      const data = { registered: "aslhasd", device_id: "some-uuid" };

      if (data.registered) {
        setIsRegistered(true);
        setRegisteredUuid(data.device_id);
        setMessage({
          type: "success",
          text: "Product already registered",
        });
      }
    } catch (err) {
      console.error("Error checking registration:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const session = await getSession();

      const res = await fetch("/api/product/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ device_id: uuid.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: data.message,
        });
        setIsRegistered(true);
        setRegisteredUuid(uuid.trim());
        setUuid("");
      } else {
        setMessage({
          type: "error",
          text: data.error,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to register product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/product/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: registeredUuid, userId }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setMessage({
          type: "success",
          text: "Session verified successfully!",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Verification failed",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to verify session. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-primary-100 p-3 rounded-full">
            <Key className="w-8 h-8 text-primary-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Product Registration
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">
          Register your product UUID to activate your license
        </p>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-800" : "text-red-800"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        {isRegistered ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Registered UUID:
              </p>
              <p className="text-xs font-mono text-gray-900 bg-white px-3 py-2 rounded border border-gray-200 break-all">
                {registeredUuid}
              </p>
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Session"
              )}
            </button>

            <button
              onClick={() => {
                setIsRegistered(false);
                setRegisteredUuid("");
                setMessage({ type: "", text: "" });
              }}
              className="w-full text-primary-600 py-2 px-4 rounded-lg font-medium hover:bg-primary-50 transition-colors text-sm"
            >
              Register Different Product
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="uuid"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product UUID
              </label>
              <input
                id="uuid"
                type="text"
                value={uuid}
                onChange={(e) => setUuid(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && uuid.trim()) {
                    handleSubmit();
                  }
                }}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-sm"
              />
              <p className="mt-2 text-xs text-gray-500">
                Enter the unique identifier from your product
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !uuid.trim()}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Product"
              )}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Your product can only be used on one device at a time. Registration
            prevents unauthorized sharing.
          </p>
        </div>
      </div>
    </>
  );
}
