import { useState } from "react";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  HeartIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ProfileCard from "./ProfileCard";
import Orders from "./MyOrders";
import Wishlist from "./Wishlist";
import Cart from "./Cart";
import Settings from "./Settings";

import {
  baseBackground,
  containerStyle,
  cardStyle,
  buttonStyle,
  sectionPadding,
} from "../theme";

const tabs = [
  { id: "profile", icon: UserCircleIcon, label: "Profile" },
  { id: "orders", icon: ShoppingBagIcon, label: "Orders" },
  { id: "wishlist", icon: HeartIcon, label: "Wishlist" },
  { id: "cart", icon: ShoppingCartIcon, label: "Cart" },
  { id: "settings", icon: Cog6ToothIcon, label: "Settings" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Render content for the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileCard />;
      case "orders":
        return <Orders />;
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      case "settings":
        return <Settings />;
      default:
        return <ProfileCard />;
    }
  };

  return (
    <div className={`${baseBackground} min-h-screen ${sectionPadding}`}>
      {/* Desktop Layout */}
      <div className={`${containerStyle} max-w-7xl mx-auto flex flex-col lg:flex-row gap-10`}>
        
        {/* Sidebar Navigation */}
        <nav
          aria-label="Profile navigation"
          className="hidden lg:flex flex-col w-64 bg-white rounded-2xl shadow-lg p-6 sticky top-24 self-start select-none"
        >
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 mb-4 py-3 px-5 rounded-xl font-semibold transition-colors duration-200
                  ${isActive ? "bg-rose-600 text-white shadow-md" : "text-gray-600 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"}
                `}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content Area */}
        <main className={`${cardStyle} flex-1 bg-white p-8 rounded-3xl shadow-lg min-h-[600px]`}>
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Mobile profile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg lg:hidden"
      >
        <div className="flex justify-around">
          {/* Home Button */}
          <button
            onClick={() => (window.location.href = "/")}
            aria-label="Home"
            className="flex flex-col items-center p-3 text-gray-500 hover:text-rose-600 transition-colors"
          >
            <HomeIcon className="h-6 w-6 mb-1" aria-hidden="true" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          {/* Profile Tabs */}
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                className={`flex flex-col items-center p-3 text-xs font-semibold transition-colors
                  ${isActive ? "text-rose-600 bg-rose-50" : "text-gray-500 hover:text-rose-600"}`}
              >
                <Icon className="h-6 w-6 mb-1" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
