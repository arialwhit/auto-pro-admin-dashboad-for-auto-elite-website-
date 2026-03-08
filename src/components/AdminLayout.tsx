import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  CreditCard, 
  Settings, 
  Users, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLogout: () => void;
}

export default function AdminLayout({ children, activeTab, setActiveTab, user, onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'financing', label: 'Financing', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'users', label: 'Admin Users', icon: Users },
    { id: 'ai', label: 'AI Settings', icon: Bot },
    { id: 'settings', label: 'Website Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#1A1A1A] font-sans">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          {isSidebarOpen ? (
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AutoPro Admin
            </span>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              {isSidebarOpen && activeTab === item.id && (
                <ChevronRight size={16} className="ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search vehicles, bookings, customers..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
