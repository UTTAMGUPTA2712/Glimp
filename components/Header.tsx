"use client";
import { getSession, signOut } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [session, setSession] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      setSession(sessionData?.user || null);
    }
    fetchSession();
  }, []);

  async function handleSignOut() {
    await signOut();
    setSession(null);
    window.location.href = "/";
  }

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="">
              <img src="/app-icon.png" alt="Glimp AI" width={40} />
            </Link>
            <Link href="/" className="flex items-center gap-2 overflow-hidden h-20">
              <img src="/logo.png" alt="Glimp AI" className="h-100" width={100} />
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link
              href="/download"
              className="text-gray-600 hover:text-gray-900"
            >
              Download
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900">
              Support
            </Link>
            <Link href="/legal" className="text-gray-600 hover:text-gray-900">
              Legal
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn btn-primary">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="flex flex-col space-y-3 py-4">
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link
                href="/download"
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                onClick={closeMobileMenu}
              >
                Download
              </Link>
              <Link
                href="/support"
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                onClick={closeMobileMenu}
              >
                Support
              </Link>
              <Link
                href="/legal"
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
                onClick={closeMobileMenu}
              >
                Legal
              </Link>
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="btn btn-primary mx-4 w-auto"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary mx-4 w-auto inline-block text-center"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}