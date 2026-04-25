import { useState } from 'react';
import Dashboard from './components/Dashboard';
import OrderBook from './components/OrderBook';
import Trades from './components/Trades';
import Positions from './components/Positions';
import {
  LayoutDashboard,
  ScrollText,
  ArrowLeftRight,
  Briefcase,
  TrendingUp,
} from 'lucide-react';

type Tab = 'dashboard' | 'orders' | 'trades' | 'positions';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ScrollText },
    { id: 'trades', label: 'Trades', icon: ArrowLeftRight },
    { id: 'positions', label: 'Positions', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Trading OMS</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Order Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <h2 className="text-2xl font-bold text-gray-900">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
        </div>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'orders' && <OrderBook />}
        {activeTab === 'trades' && <Trades />}
        {activeTab === 'positions' && <Positions />}
      </main>

      <footer className="border-t border-gray-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-gray-400 text-center">
            Trading Order Management System &mdash; Built with Spring Boot & React
          </p>
        </div>
      </footer>
    </div>
  );
}
