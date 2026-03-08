import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { Booking } from '../types';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Drive Bookings</h1>
        <p className="text-gray-500 mt-1">Manage customer appointments and test drive requests.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading bookings...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No bookings found.</td>
                </tr>
              ) : bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{booking.customer_name}</p>
                      <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                        <span className="flex items-center"><Mail size={12} className="mr-1" /> {booking.customer_email}</span>
                        <span className="flex items-center"><Phone size={12} className="mr-1" /> {booking.customer_phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                      {booking.vehicle_title}
                      <ExternalLink size={14} className="ml-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <CalendarIcon size={14} className="mr-2 text-gray-400" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(booking.booking_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                      booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                      booking.status === 'completed' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {booking.status === 'confirmed' && <CheckCircle2 size={12} className="mr-1" />}
                      {booking.status === 'cancelled' && <XCircle size={12} className="mr-1" />}
                      {booking.status === 'pending' && <Clock size={12} className="mr-1" />}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Confirm"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
