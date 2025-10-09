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
          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 min-w-[140px] justify-center ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="pb-16 flex justify-center">{renderTab(activeTab)}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
