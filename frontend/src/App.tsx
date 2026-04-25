import { useState } from "react";
import Dashboard from "./components/Dashboard";
import OrderBook from "./components/OrderBook";
import Trades from "./components/Trades";
import Positions from "./components/Positions";
import { useTheme } from "./contexts/ThemeContext";
import {
  LayoutDashboard,
  ScrollText,
  ArrowLeftRight,
  Briefcase,
  TrendingUp,
  Moon,
  Sun,
} from "lucide-react";

type Tab = "dashboard" | "orders" | "trades" | "positions";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { isDark, toggleTheme } = useTheme();

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ScrollText },
    { id: "trades", label: "Trades", icon: ArrowLeftRight },
    { id: "positions", label: "Positions", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                  Trading OMS
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 -mt-0.5">
                  Order Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "orders" && <OrderBook />}
        {activeTab === "trades" && <Trades />}
        {activeTab === "positions" && <Positions />}
      </main>

      <footer className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
            © Trading Order Management System 2026 | Built with Spring Boot &
            React | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
