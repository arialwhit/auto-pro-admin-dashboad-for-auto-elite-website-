import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Car, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Mail,
  Clock
} from 'lucide-react';
import { Vehicle, Booking, FinancingApplication } from '../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    pendingBookings: 0,
    financingRequests: 0,
    totalRevenue: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vRes, bRes, fRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/bookings'),
        fetch('/api/financing')
      ]);

      const vehicles: Vehicle[] = await vRes.json();
      const bookings: Booking[] = await bRes.json();
      const financing: FinancingApplication[] = await fRes.json();

      setStats({
        totalCars: vehicles.length,
        availableCars: vehicles.filter(v => v.status === 'available').length,
        soldCars: vehicles.filter(v => v.status === 'sold').length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        financingRequests: financing.filter(f => f.status === 'pending').length,
        totalRevenue: vehicles.filter(v => v.status === 'sold').reduce((acc, v) => acc + v.price, 0)
      });

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'booking', text: 'New test drive booking for Toyota Camry', time: '2 mins ago', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
        { id: 2, type: 'vehicle', text: 'Tesla Model 3 marked as Sold', time: '45 mins ago', icon: Car, color: 'text-green-600 bg-green-50' },
        { id: 3, type: 'financing', text: 'New financing application from John Doe', time: '2 hours ago', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
        { id: 4, type: 'message', text: 'New inquiry about 2023 BMW M4', time: '5 hours ago', icon: Mail, color: 'text-orange-600 bg-orange-50' },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  const statCards = [
    { label: 'Total Inventory', value: stats.totalCars, icon: Car, trend: '+12%', isUp: true },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, trend: '+5%', isUp: true },
    { label: 'Financing Requests', value: stats.financingRequests, icon: TrendingUp, trend: '-2%', isUp: false },
    { label: 'Total Revenue', value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`, icon: ArrowUpRight, trend: '+18%', isUp: true },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your dealership today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
            <Mail size={16} className="mr-2" />
            View Messages
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
            <Plus size={16} className="mr-2" />
            Add New Vehicle
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                <stat.icon size={24} className="text-gray-600 group-hover:text-blue-600" />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {stat.isUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 flex items-start hover:bg-gray-50 transition-colors">
                <div className={`p-3 rounded-xl mr-4 ${activity.color}`}>
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                  <div className="flex items-center mt-1 text-xs text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {activity.time}
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Inventory Status</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Available</span>
                <span className="text-gray-900 font-bold">{stats.availableCars}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(stats.availableCars / stats.totalCars) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Sold</span>
                <span className="text-gray-900 font-bold">{stats.soldCars}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${(stats.soldCars / stats.totalCars) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500 font-medium">Reserved</span>
                <span className="text-gray-900 font-bold">{stats.totalCars - stats.availableCars - stats.soldCars}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: `${((stats.totalCars - stats.availableCars - stats.soldCars) / stats.totalCars) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-500 font-medium mb-1">New Arrivals</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Hot Deals</p>
              <p className="text-xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
