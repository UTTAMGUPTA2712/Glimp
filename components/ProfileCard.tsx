"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import { Check, Copy } from "lucide-react";
import { CopyToClipboard } from "@/lib/helper";

type ProfileData = {
  name: string | null;
  email: string | null;
  userId: string | null;
};

export default function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData>({
    name: null,
    email: null,
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError(null);

        const session = await getSession();
        const user = session?.user;

        if (mounted) {
          setProfile({
            name:
              (user?.user_metadata as any)?.full_name ||
              (user?.user_metadata as any)?.name ||
              null,
            email: user?.email || null,
            userId: user?.id || null,
          });
        }
      } catch (e: any) {
        if (mounted) {
          setError(e?.message || "Failed to load profile");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

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
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <a href="/login" className="btn btn-primary">
          Login
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-gray-900 mt-1">{profile.name || "—"}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-gray-900 mt-1">{profile.email || "—"}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-500">User ID</label>
          <p className="text-gray-900 mt-1 break-all font-mono text-sm">
            {profile.userId || "—"}
          </p>
          {profile.userId && (
            <button
              type="button"
              onClick={async () => {
                await CopyToClipboard(profile.userId!);
              }}
              className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 border border-gray-200 text-gray-700"
              aria-label="Copy User ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
