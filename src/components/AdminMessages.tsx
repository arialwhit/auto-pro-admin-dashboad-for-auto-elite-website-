import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Reply,
  Archive,
  Star
} from 'lucide-react';
import { Message } from '../types';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data);
      if (data.length > 0) setSelectedMessage(data[0]);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6">
      {/* Message List */}
      <div className="w-1/3 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Inbox</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading inbox...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No messages yet.</div>
          ) : messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className={`w-full p-6 text-left hover:bg-gray-50 transition-all relative ${
                selectedMessage?.id === msg.id ? 'bg-blue-50/50' : ''
              }`}
            >
              {!msg.read && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              )}
              <div className="flex justify-between items-start mb-1">
                <p className={`text-sm font-bold ${msg.read ? 'text-gray-600' : 'text-gray-900'}`}>{msg.name}</p>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className={`text-xs font-bold truncate ${msg.read ? 'text-gray-500' : 'text-blue-600'}`}>{msg.subject}</p>
              <p className="text-xs text-gray-400 truncate mt-1">{msg.message}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {selectedMessage ? (
          <>
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl">
                  {selectedMessage.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedMessage.name}</h3>
                  <p className="text-xs text-gray-500">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Star size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"><Archive size={20} /></button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h2>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock size={14} className="mr-1" />
                  {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="flex-1 bg-white border border-gray-200 py-3 rounded-2xl text-sm font-bold text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                  <Reply size={18} className="mr-2" />
                  Reply via Email
                </button>
                <button className="flex-1 bg-blue-600 py-3 rounded-2xl text-sm font-bold text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Quick Response
                  <ChevronRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Mail size={48} className="mb-4 opacity-20" />
            <p>Select a message to read</p>
          </div>
        )}
      </div>
    </div>
  );
}
