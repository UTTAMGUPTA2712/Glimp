"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlanManagementCard from "@/components/PlanManagementCard";
import ProductRegistration from "@/components/ProductRegistration";
import ProfileCard from "@/components/ProfileCard";
import { User, CreditCard, Key } from "lucide-react";

type TabType = "profile" | "plan" | "product";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isTabLoading, setIsTabLoading] = useState(false);

  const tabs = [
    { id: "profile" as TabType, label: "Profile", icon: User },
    { id: "plan" as TabType, label: "Plan & Billing", icon: CreditCard },
    { id: "product" as TabType, label: "Product License", icon: Key },
  ];

  const renderTab = (tabType: TabType) => {
    switch (tabType) {
      case "profile":
        return <ProfileCard />;
      case "plan":
        return <PlanManagementCard />;
      case "product":
        return <ProductRegistration />;
      default:
        return <ProfileCard />;
    }
  };

  const handleSetActiveTab = (next: TabType) => {
    if (next === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(next);
    // Provide a short, consistent loading feedback when switching tabs
    window.setTimeout(() => setIsTabLoading(false), 300);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="text-gray-900 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Dashboard
            </h1>
          </div>
        </section>

        <div className="container mx-auto max-w-7xl px-4 -mt-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Left vertical tabs (responsive) */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-2">
                <div className="flex md:flex-col gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleSetActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors w-full justify-start ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* Content area */}
            <section className="flex-1">
              <div className="relative pb-16 flex justify-center">
                {isTabLoading && (
                  <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                    <div role="status" aria-live="polite" className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
                      <span className="text-sm text-gray-700">Loading…</span>
                    </div>
                  </div>
                )}
                <div className={isTabLoading ? "opacity-50 pointer-events-none" : ""}>
                  {renderTab(activeTab)}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
