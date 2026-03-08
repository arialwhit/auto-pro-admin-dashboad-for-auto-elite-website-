import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Save,
  AlertCircle
} from 'lucide-react';

export default function AdminAISettings() {
  const [aiConfig, setAiConfig] = useState({
    enabled: true,
    model: 'gemini-3-flash-preview',
    greeting: 'Hello! I am your AutoPro assistant. How can I help you find your dream car today?',
    personality: 'Professional, helpful, and knowledgeable about cars.',
    maxResponses: 10,
    recommendationLogic: 'price_and_type'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Control Panel</h1>
        <p className="text-gray-500 mt-1">Configure your AI assistant's behavior and intelligence settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-xl text-white mr-4">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900">AI Assistant Status</h3>
                  <p className="text-xs text-blue-700">Currently active on your website</p>
                </div>
              </div>
              <button 
                onClick={() => setAiConfig({ ...aiConfig, enabled: !aiConfig.enabled })}
                className={`w-14 h-7 rounded-full transition-all relative ${aiConfig.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${aiConfig.enabled ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Greeting Message</label>
                <textarea 
                  rows={3}
                  value={aiConfig.greeting}
                  onChange={(e) => setAiConfig({ ...aiConfig, greeting: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">AI Personality & Tone</label>
                <textarea 
                  rows={3}
                  value={aiConfig.personality}
                  onChange={(e) => setAiConfig({ ...aiConfig, personality: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="e.g. You are a friendly sales expert who focuses on safety features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Model Selection</label>
                  <select 
                    value={aiConfig.model}
                    onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  >
                    <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                    <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Advanced)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Max Responses / Session</label>
                  <input 
                    type="number" 
                    value={aiConfig.maxResponses}
                    onChange={(e) => setAiConfig({ ...aiConfig, maxResponses: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Save AI Configuration
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Zap size={18} className="mr-2 text-orange-500" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Conversations</span>
                <span className="text-sm font-bold text-gray-900">1,284</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Avg. Response Time</span>
                <span className="text-sm font-bold text-gray-900">0.8s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Customer Satisfaction</span>
                <span className="text-sm font-bold text-green-600">94%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-200">
            <Sparkles size={32} className="mb-4 opacity-50" />
            <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Detailed personality instructions help the AI better represent your brand's unique voice and sales strategy.
            </p>
          </div>

          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start">
            <AlertCircle size={20} className="text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-orange-700 leading-relaxed">
              Changing the AI model may affect response latency and token usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
