import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Globe, 
  Mail, 
  Palette, 
  Shield, 
  Save, 
  Upload,
  CheckCircle2
} from 'lucide-react';
import { AppSettings } from '../types';

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState<'general' | 'email' | 'theme' | 'seo'>('general');
  const [settings, setSettings] = useState<AppSettings>({
    websiteName: 'AutoPro Elite',
    contactEmail: 'sales@autopro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Dealer Row, Motor City, MC 12345',
    currency: 'USD',
    aiEnabled: true,
    primaryColor: '#2563eb',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'notifications@autopro.com',
    smtpPass: '••••••••',
    senderEmail: 'no-reply@autopro.com',
    autoReplyTemplate: 'Hello {name},\n\nThank you for your inquiry about the {vehicle}. Our team will contact you shortly.\n\nBest regards,\nAutoPro Team'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost: settings.smtpHost,
          smtpPort: settings.smtpPort,
          smtpUser: settings.smtpUser,
          senderEmail: settings.senderEmail
        })
      });
      const data = await res.json();
      setTestResult({ success: data.success, message: data.message });
      setTimeout(() => setTestResult(null), 5000);
    } catch (error) {
      setTestResult({ success: false, message: 'Failed to connect to the server.' });
      setTimeout(() => setTestResult(null), 5000);
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
          <p className="text-gray-500 mt-1">Configure your dealership's global information and preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          ) : (
            <Save size={18} className="mr-2" />
          )}
          Save Changes
        </button>
      </div>

      {showSuccess && (
        <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={20} className="mr-2" />
          Settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveSection('general')}
            className={`w-full flex items-center p-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'general' ? 'bg-white border border-gray-200 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}
          >
            <Globe size={18} className="mr-3" />
            General Information
          </button>
          <button 
            onClick={() => setActiveSection('email')}
            className={`w-full flex items-center p-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'email' ? 'bg-white border border-gray-200 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}
          >
            <Mail size={18} className="mr-3" />
            Email Configuration
          </button>
          <button 
            onClick={() => setActiveSection('theme')}
            className={`w-full flex items-center p-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'theme' ? 'bg-white border border-gray-200 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}
          >
            <Palette size={18} className="mr-3" />
            Theme & Branding
          </button>
          <button 
            onClick={() => setActiveSection('seo')}
            className={`w-full flex items-center p-3 rounded-xl text-sm font-bold transition-all ${
              activeSection === 'seo' ? 'bg-white border border-gray-200 text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}
          >
            <Shield size={18} className="mr-3" />
            SEO & Security
          </button>
        </div>

        {/* Form */}
        <div className="md:col-span-2 space-y-6">
          {activeSection === 'general' && (
            <>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Website Name</label>
                    <input 
                      type="text" 
                      value={settings.websiteName}
                      onChange={(e) => setSettings({ ...settings, websiteName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Contact Email</label>
                      <input 
                        type="email" 
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone Number</label>
                      <input 
                        type="text" 
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Business Address</label>
                    <textarea 
                      rows={3}
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-gray-900">AI Assistant Enabled</p>
                      <p className="text-xs text-gray-500">Allow the AI chatbot to interact with customers</p>
                    </div>
                    <button 
                      onClick={() => setSettings({ ...settings, aiEnabled: !settings.aiEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${settings.aiEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.aiEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center">
                  <Upload size={18} className="mr-2 text-blue-600" />
                  Logo & Branding
                </h3>
                <div className="flex items-center space-x-8">
                  <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-all">
                    <Upload size={24} />
                    <span className="text-[10px] font-bold mt-2">UPLOAD</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Main Logo</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 256x256px. PNG or SVG preferred.</p>
                    <button className="mt-3 text-xs font-bold text-blue-600 hover:underline">Remove current logo</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'email' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">SMTP Settings</h3>
                  <button 
                    onClick={handleTestConnection}
                    disabled={isTestingEmail}
                    className="flex items-center px-4 py-2 bg-gray-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all border border-blue-100 disabled:opacity-50"
                  >
                    {isTestingEmail ? (
                      <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                    ) : (
                      <CheckCircle2 size={14} className="mr-2" />
                    )}
                    Test Connection
                  </button>
                </div>

                {testResult && (
                  <div className={`p-4 rounded-2xl text-xs font-medium flex items-center animate-in fade-in slide-in-from-top-2 ${
                    testResult.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {testResult.success ? <CheckCircle2 size={16} className="mr-2" /> : <Shield size={16} className="mr-2" />}
                    {testResult.message}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">SMTP Host</label>
                      <input 
                        type="text" 
                        value={settings.smtpHost}
                        onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Port</label>
                      <input 
                        type="text" 
                        value={settings.smtpPort}
                        onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Username</label>
                      <input 
                        type="text" 
                        value={settings.smtpUser}
                        onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Password</label>
                      <input 
                        type="password" 
                        value={settings.smtpPass}
                        onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Sender Email Address</label>
                    <input 
                      type="email" 
                      value={settings.senderEmail}
                      onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Auto-Reply Template</h3>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">Lead Response</span>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Template Content</label>
                  <p className="text-xs text-gray-400 mb-2">Use placeholders: {'{name}'}, {'{vehicle}'}, {'{date}'}</p>
                  <textarea 
                    rows={6}
                    value={settings.autoReplyTemplate}
                    onChange={(e) => setSettings({ ...settings, autoReplyTemplate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {(activeSection === 'theme' || activeSection === 'seo') && (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                {activeSection === 'theme' ? <Palette size={32} /> : <Shield size={32} />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Section Under Development</h3>
              <p className="text-sm text-gray-500">This configuration panel will be available in the next update.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
