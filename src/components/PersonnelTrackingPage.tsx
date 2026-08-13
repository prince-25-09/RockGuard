import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Radio,
  MapPin,
  Heart,
  Battery,
  Search,
  Bell,
  Activity,
  ArrowRight,
  User,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { PersonnelRecord } from '../types';

interface PersonnelTrackingPageProps {
  personnel: PersonnelRecord[];
  onOpenAIChat: () => void;
}

export const PersonnelTrackingPage: React.FC<PersonnelTrackingPageProps> = ({
  personnel,
  onOpenAIChat
}) => {
  const [selectedWorker, setSelectedWorker] = useState<PersonnelRecord | null>(personnel[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SAFE' | 'CAUTION' | 'EMERGENCY'>('ALL');

  const filteredPersonnel = personnel.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.sector.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPersonnel = 124;
  const safeCount = 108;
  const cautionCount = 13;
  const emergencyCount = 3;

  // 24h trend data for personnel safety
  const personnelTrendData = [
    { time: '00:00', safe: 120, caution: 4, emergency: 0 },
    { time: '04:00', safe: 118, caution: 6, emergency: 0 },
    { time: '08:00', safe: 115, caution: 9, emergency: 0 },
    { time: '12:00', safe: 112, caution: 11, emergency: 1 },
    { time: '16:00', safe: 110, caution: 12, emergency: 2 },
    { time: '20:00', safe: 108, caution: 13, emergency: 3 },
    { time: '22:14', safe: 108, caution: 13, emergency: 3 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Total Personnel
          </span>
          <div className="text-2xl font-black text-slate-900">{totalPersonnel}</div>
          <span className="text-[10px] text-slate-500 font-mono">100% Signal Tracking</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Safe
          </span>
          <div className="text-2xl font-black text-emerald-600">{safeCount}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Normal Vitals</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Caution
          </span>
          <div className="text-2xl font-black text-[#F27D26]">{cautionCount}</div>
          <span className="text-[10px] text-[#F27D26] font-semibold">Near Risk Buffer</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Emergency
          </span>
          <div className="text-2xl font-black text-red-600">{emergencyCount}</div>
          <span className="text-[10px] text-red-600 font-semibold animate-pulse">Sector B-12 Danger</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Last Update
          </span>
          <div className="text-lg font-black text-[#F27D26] font-mono">12 sec ago</div>
          <span className="text-[10px] text-slate-500">Radio Mesh Beacon 433MHz</span>
        </div>
      </div>

      {/* MAIN CONTAINER: LIVE MAP + RIGHT ROSTER PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Personnel Terrain Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#F27D26]" />
              <span>Live Personnel Location Map</span>
            </h3>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe
              </span>
              <span className="flex items-center gap-1 text-[#F27D26]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26]" /> Caution
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Emergency
              </span>
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-2xl border border-slate-200 bg-[#0B192E] overflow-hidden shadow-sm p-6 text-white">
            {/* Terrain Image Simulation Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1600&q=80')`
              }}
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Worker Pin Markers */}
            <div className="relative z-10 w-full h-[360px]">
              {personnel.map((worker) => {
                const isSelected = selectedWorker?.id === worker.id;
                const isEmergency = worker.status === 'EMERGENCY';
                const isCaution = worker.status === 'CAUTION';

                const markerBg = isEmergency
                  ? 'bg-red-600 border-red-300 text-white'
                  : isCaution
                  ? 'bg-[#F27D26] border-orange-200 text-white'
                  : 'bg-emerald-500 border-emerald-300 text-slate-950';

                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker)}
                    style={{
                      left: `${worker.coordinates.x}%`,
                      top: `${worker.coordinates.y}%`
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    {isEmergency && (
                      <span className="animate-ping absolute -inset-1 rounded-full bg-red-600 opacity-80" />
                    )}

                    <div
                      className={`relative px-2.5 py-1 rounded-xl border font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 ${markerBg} ${
                        isSelected ? 'scale-125 ring-4 ring-[#F27D26] z-20' : 'hover:scale-110'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{worker.name.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Worker Modal/Popup */}
            {selectedWorker && (
              <div className="relative z-20 bg-[#1E293B]/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{selectedWorker.name}</span>
                      <span className="text-xs font-mono text-[#F27D26]">({selectedWorker.id})</span>
                    </h4>
                    <p className="text-xs text-slate-300">{selectedWorker.role} • {selectedWorker.sector}</p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                    selectedWorker.status === 'EMERGENCY'
                      ? 'bg-red-600 text-white'
                      : selectedWorker.status === 'CAUTION'
                      ? 'bg-[#F27D26] text-white'
                      : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {selectedWorker.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#0B192E] border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="font-bold text-red-400 flex items-center justify-center gap-1">
                      <Heart className="w-3 h-3" /> {selectedWorker.heartRate || 74} BPM
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0B192E] border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Helmet Battery</span>
                    <span className="font-bold text-[#F27D26] flex items-center justify-center gap-1">
                      <Battery className="w-3 h-3" /> {selectedWorker.helmetBattery || 90}%
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0B192E] border border-slate-700 text-center">
                    <span className="text-[10px] text-slate-400 block">Beacon</span>
                    <span className="font-bold text-emerald-400">{selectedWorker.beaconSignal || 'Strong'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => alert(`Dispatching emergency locate beacon to ${selectedWorker.name} in ${selectedWorker.sector}`)}
                    className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    Locate Worker
                  </button>
                  <button
                    onClick={() => alert(`Supervisor notification sent for ${selectedWorker.name}`)}
                    className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs border border-slate-600 transition cursor-pointer"
                  >
                    Alert Supervisor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Personnel Status List */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F27D26]" />
                <span>Personnel Roster</span>
              </h3>
              <span className="text-xs font-bold text-[#F27D26]">{filteredPersonnel.length} Listed</span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter personnel name/role..."
                  className="w-full h-9 pl-9 pr-3 bg-slate-50 border border-slate-200 focus:border-[#F27D26] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === 'ALL' ? 'bg-[#F27D26] text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('EMERGENCY')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === 'EMERGENCY' ? 'bg-red-600 text-white' : 'bg-slate-100 text-red-600'
                  }`}
                >
                  Emergency (3)
                </button>
                <button
                  onClick={() => setStatusFilter('CAUTION')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    statusFilter === 'CAUTION' ? 'bg-[#F27D26] text-white' : 'bg-slate-100 text-[#F27D26]'
                  }`}
                >
                  Caution
                </button>
              </div>
            </div>

            {/* Roster Items */}
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredPersonnel.map((worker) => {
                const isSelected = selectedWorker?.id === worker.id;
                const isEmergency = worker.status === 'EMERGENCY';

                return (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-50 border-[#F27D26]'
                        : isEmergency
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{worker.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({worker.id})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{worker.role} • <strong className="text-[#F27D26]">{worker.sector}</strong></div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      worker.status === 'EMERGENCY'
                        ? 'bg-red-600 text-white'
                        : worker.status === 'CAUTION'
                        ? 'bg-[#F27D26] text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {worker.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onOpenAIChat}
            className="w-full py-2.5 rounded-xl bg-[#0B192E] hover:bg-[#1E293B] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Consult RockGuard AI on Personnel Evacuation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM: 24H STATUS TREND CHART */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#F27D26]" />
            <span>24-Hour Personnel Safety Status Trend</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Jharia Safety Logs</span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={personnelTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.75rem',
                  color: '#0f172a',
                  fontSize: '12px'
                }}
              />
              <Line type="monotone" dataKey="safe" stroke="#10b981" strokeWidth={3} name="Safe Personnel" />
              <Line type="monotone" dataKey="caution" stroke="#F27D26" strokeWidth={2} name="Caution" />
              <Line type="monotone" dataKey="emergency" stroke="#dc2626" strokeWidth={3} name="Emergency Hazard Zone" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
