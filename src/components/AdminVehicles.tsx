import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Car
} from 'lucide-react';
import { Vehicle } from '../types';

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setVehicles(vehicles.filter(v => v.id !== id));
    } catch (error) {
      console.error("Failed to delete vehicle", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your car listings, images, and pricing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
        >
          <Plus size={18} className="mr-2" />
          Add New Vehicle
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by make, model, or VIN..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="bg-gray-50 border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Status</option>
            <option>Available</option>
            <option>Sold</option>
            <option>Reserved</option>
          </select>
          <select className="bg-gray-50 border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <option>All Conditions</option>
            <option>New</option>
            <option>Used</option>
            <option>Certified</option>
          </select>
          <button className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Year/Mileage</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading inventory...</td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No vehicles found. Add your first listing!</td>
                </tr>
              ) : vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden mr-4 flex-shrink-0">
                        {vehicle.images?.[0] ? (
                          <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Car size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{vehicle.title}</p>
                        <p className="text-xs text-gray-500">{vehicle.make} {vehicle.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      vehicle.status === 'available' ? 'bg-green-50 text-green-600' :
                      vehicle.status === 'sold' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {vehicle.status === 'available' && <CheckCircle2 size={12} className="mr-1" />}
                      {vehicle.status === 'sold' && <XCircle size={12} className="mr-1" />}
                      {vehicle.status === 'reserved' && <Clock size={12} className="mr-1" />}
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900 font-medium">{vehicle.year}</p>
                    <p className="text-xs text-gray-500">{vehicle.mileage.toLocaleString()} miles</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">${vehicle.price.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteVehicle(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal Placeholder */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New Vehicle</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {/* Form would go here */}
              <p className="text-gray-500 text-center py-12">Vehicle creation form implementation...</p>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-600 hover:text-gray-900">Cancel</button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Save Vehicle</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
