import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Shield,
  Filter,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertManagementPageProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (alertId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onOpenAIChat: () => void;
}

export const AlertManagementPage: React.FC<AlertManagementPageProps> = ({
  alerts,
  onAcknowledgeAlert,
  onResolveAlert,
  onOpenAIChat
}) => {
  const [filterTab, setFilterTab] = useState<'ALL' | 'CRITICAL' | 'WARNINGS' | 'ACTIVE' | 'RESOLVED'>('ALL');
  const [selectedDetailAlert, setSelectedDetailAlert] = useState<AlertItem | null>(null);

  const filteredAlerts = alerts.filter((item) => {
    if (filterTab === 'CRITICAL') return item.severity === 'CRITICAL';
    if (filterTab === 'WARNINGS') return item.severity === 'WARNING';
    if (filterTab === 'ACTIVE') return item.status === 'ACTIVE';
    if (filterTab === 'RESOLVED') return item.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner - Bento Dark Navy Accent Card */}
      <div className="p-6 rounded-2xl bg-[#0B192E] text-white shadow-lg border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-300 font-extrabold text-[10px] tracking-widest uppercase border border-red-500/30">
              SAFETY DISPATCH CONTROL
            </span>
            <span className="text-xs text-slate-300 font-medium">Mine Site Early Warning Protocol</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Alert Management</h2>
          <p className="text-xs text-slate-300">
            Acknowledge, dispatch, and resolve automated geotechnical & sensor risk warnings.
          </p>
        </div>

        <button
          onClick={onOpenAIChat}
          className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Ask RockGuard AI Copilot</span>
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap gap-1 text-xs font-bold text-slate-700 w-fit">
        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            filterTab === 'ALL' ? 'bg-[#F27D26] text-white shadow-sm' : 'hover:bg-slate-100'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilterTab('CRITICAL')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            filterTab === 'CRITICAL' ? 'bg-red-600 text-white shadow-sm' : 'hover:bg-slate-100 text-red-600'
          }`}
        >
          Critical ({alerts.filter((a) => a.severity === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setFilterTab('WARNINGS')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            filterTab === 'WARNINGS' ? 'bg-[#F27D26] text-white shadow-sm' : 'hover:bg-slate-100 text-[#F27D26]'
          }`}
        >
          Warnings ({alerts.filter((a) => a.severity === 'WARNING').length})
        </button>
        <button
          onClick={() => setFilterTab('ACTIVE')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            filterTab === 'ACTIVE' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100'
          }`}
        >
          Active ({alerts.filter((a) => a.status === 'ACTIVE').length})
        </button>
        <button
          onClick={() => setFilterTab('RESOLVED')}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            filterTab === 'RESOLVED' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:bg-slate-100 text-emerald-600'
          }`}
        >
          Resolved ({alerts.filter((a) => a.status === 'RESOLVED').length})
        </button>
      </div>

      {/* ALERT CARDS LIST */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';

          const borderStyle = isCritical
            ? 'border-red-300 bg-red-50/50 shadow-sm'
            : isWarning
            ? 'border-orange-200 bg-orange-50/30 shadow-sm'
            : 'border-slate-200 bg-white shadow-sm';

          const badgeStyle = isCritical
            ? 'bg-red-600 text-white font-bold'
            : isWarning
            ? 'bg-[#F27D26] text-white font-bold'
            : 'bg-orange-100 text-[#F27D26] border border-orange-200 font-bold';

          return (
            <div
              key={alert.id}
              className={`p-6 rounded-2xl border ${borderStyle} transition-all duration-300 space-y-4 bg-white`}
            >
              {/* Top info line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs tracking-wider uppercase ${badgeStyle}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-mono text-[#F27D26] font-bold">{alert.id}</span>
                  <span className="text-xs font-bold text-slate-800">• {alert.sector}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {alert.timestamp}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                    Source: {alert.sensorSource}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{alert.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{alert.description}</p>
              </div>

              {/* Recommended Actions Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Recommended Operational Directives:
                </span>
                <div className="flex flex-wrap gap-2">
                  {alert.recommendedActions.map((act, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{act}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Assigned & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <UserCheck className="w-4 h-4 text-[#F27D26]" />
                  <span>Assigned Supervisor: <strong className="text-slate-900">{alert.assignedTo}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold transition cursor-pointer shadow-sm"
                    >
                      Acknowledge Alert
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer shadow-sm"
                    >
                      Resolve Alert
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedDetailAlert(alert)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ALERT DETAILS MODAL */}
      {selectedDetailAlert && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 text-slate-900 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold">{selectedDetailAlert.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDetailAlert(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Alert ID & Sector</span>
                <span className="font-bold text-[#F27D26]">{selectedDetailAlert.id} — {selectedDetailAlert.sector}</span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Sensor Technical Description</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedDetailAlert.description}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Required Field Protocol</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1">
                  {selectedDetailAlert.recommendedActions.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDetailAlert(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
