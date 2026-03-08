import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  User, 
  DollarSign, 
  FileText,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { FinancingApplication } from '../types';

export default function AdminFinancing() {
  const [applications, setApplications] = useState<FinancingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFinancing();
  }, []);

  const fetchFinancing = async () => {
    try {
      const res = await fetch('/api/financing');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch financing", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financing Applications</h1>
        <p className="text-gray-500 mt-1">Review and manage customer credit applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Applications</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Approved</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {applications.filter(a => a.status === 'approved').length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending Review</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {applications.filter(a => a.status === 'pending').length}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Info</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading applications...</td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No financing applications found.</td>
                </tr>
              ) : applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{app.customer_name}</p>
                        <p className="text-xs text-gray-500">{app.customer_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{app.vehicle_title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <DollarSign size={12} className="mr-1 text-green-600" />
                        ${app.income.toLocaleString()}/yr
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <CreditCard size={12} className="mr-1 text-blue-600" />
                        Score: {app.credit_score}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      app.status === 'approved' ? 'bg-green-50 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {app.status === 'approved' && <CheckCircle2 size={12} className="mr-1" />}
                      {app.status === 'rejected' && <XCircle size={12} className="mr-1" />}
                      {app.status === 'pending' && <Clock size={12} className="mr-1" />}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-all">
                      <FileText size={14} className="mr-1" />
                      Review Details
                    </button>
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
