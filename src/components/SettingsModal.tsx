import React, { useState, useEffect } from 'react';
import { Settings, X, Shield, Key, Database, Bell, CheckCircle2, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [healthStatus, setHealthStatus] = useState<{
    geminiKeyConfigured: boolean;
    service: string;
  } | null>(null);

  const [checking, setChecking] = useState(false);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [criticalThreshold, setCriticalThreshold] = useState(80);

  const checkBackendHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (err) {
      console.warn('Backend health check error:', err);
      setHealthStatus({ geminiKeyConfigured: false, service: 'Offline' });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkBackendHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-900 space-y-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F27D26] border border-orange-200 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">RockGuard System Settings</h3>
              <p className="text-xs text-slate-500">Mine Safety Platform Configuration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Backend & Secrets Status */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
            System & API Integrations Status
          </label>

          {/* Gemini AI API Key Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-[#F27D26]" />
              <div>
                <span className="font-bold text-slate-900 block">Gemini 2.5 Flash AI Engine</span>
                <span className="text-[10px] text-slate-500">Configured via Secrets panel (GEMINI_API_KEY)</span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1 ${
              healthStatus?.geminiKeyConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-orange-50 text-[#F27D26] border border-orange-200'
            }`}>
              {healthStatus?.geminiKeyConfigured ? (
                <>
                  <CheckCircle2 className="w-3 h-3" /> API Ready
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" /> Active Prototype Mode
                </>
              )}
            </span>
          </div>

          {/* Supabase Database Status */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="font-bold text-slate-900 block">Supabase Authentication & Data</span>
                <span className="text-[10px] text-slate-500">User sessions & RLS database tables</span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase flex items-center gap-1 ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <CheckCircle2 className="w-3 h-3" /> {isSupabaseConfigured ? 'Connected' : 'Local Persistence'}
            </span>
          </div>
        </div>

        {/* Safety Alarm Thresholds */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
            Critical Risk Alarm Threshold
          </label>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Trigger Critical Warning at Risk Score:</span>
              <span className="text-red-600 font-bold">{criticalThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(Number(e.target.value))}
              className="w-full accent-[#F27D26] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold pt-2">
            <span className="text-slate-700">Audible Siren on Highwall Breach:</span>
            <button
              onClick={() => setAudioAlerts(!audioAlerts)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                audioAlerts ? 'bg-[#F27D26] text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {audioAlerts ? 'ENABLED' : 'MUTED'}
            </button>
          </div>
        </div>

        {/* Export Safety Report */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              const report = `ROCKGUARD SAFETY AUDIT REPORT - ${new Date().toLocaleString()}\nSector B-12 Risk Score: 82/100 HIGH\nRainfall 24h: 12.4mm\nStatus: Active Hazard Warning issued.`;
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `RockGuard_Safety_Report_${Date.now()}.txt`;
              a.click();
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#F27D26]" />
            <span>Export Safety Audit (.TXT)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs transition cursor-pointer shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
