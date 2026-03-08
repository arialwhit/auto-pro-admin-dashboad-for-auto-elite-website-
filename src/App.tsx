import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import AdminVehicles from './components/AdminVehicles';
import AdminBookings from './components/AdminBookings';
import AdminFinancing from './components/AdminFinancing';
import AdminUsers from './components/AdminUsers';
import AdminSettings from './components/AdminSettings';
import AdminMessages from './components/AdminMessages';
import AdminAISettings from './components/AdminAISettings';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('admin_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'vehicles': return <AdminVehicles />;
      case 'bookings': return <AdminBookings />;
      case 'financing': return <AdminFinancing />;
      case 'users': return <AdminUsers />;
      case 'settings': return <AdminSettings />;
      case 'messages': return <AdminMessages />;
      case 'ai': return <AdminAISettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}
