import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Bell,
  Thermometer,
  Wind,
  Droplets,
  CloudRain,
  Activity,
  Users,
  ShieldAlert,
  ArrowRight,
  Eye,
  CheckCircle2,
  ChevronRight,
  Radio
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import {
  SensorReadings,
  RiskSector,
  RiskTrendPoint,
  AlertItem,
  PersonnelRecord,
  PageView
} from '../types';

interface OverviewDashboardProps {
  readings: SensorReadings;
  trendData: RiskTrendPoint[];
  sectors: RiskSector[];
  alerts: AlertItem[];
  personnel: PersonnelRecord[];
  onNavigate: (page: PageView) => void;
  onSelectSector: (sector: RiskSector) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenAIChat: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  readings,
  trendData,
  sectors,
  alerts,
  personnel,
  onNavigate,
  onSelectSector,
  onAcknowledgeAlert,
  onOpenAIChat
}) => {
  const criticalSector = sectors.find((s) => s.id === 'SEC-B12') || sectors[0];

  const totalPersonnel = personnel.length + 116; // 124 total
  const safeCount = personnel.filter((p) => p.status === 'SAFE').length + 102; // 108
  const cautionCount = personnel.filter((p) => p.status === 'CAUTION').length + 11; // 13
  const emergencyCount = personnel.filter((p) => p.status === 'EMERGENCY').length; // 3

  const liveReadingsList = [
    {
      label: 'Temperature',
      value: `${readings.temperature}°C`,
      status: 'Normal',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      progress: 56, // 28/50°C
      icon: Thermometer,
      barColor: 'bg-amber-500'
    },
    {
      label: 'Wind Speed',
      value: `${readings.windSpeed} km/h`,
      status: 'Moderate',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      progress: 36, // 18/50 km/h
      icon: Wind,
      barColor: 'bg-blue-400'
    },
    {
      label: 'Soil Moisture',
      value: `${readings.soilMoisture}%`,
      status: 'Elevated',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      progress: readings.soilMoisture,
      icon: Droplets,
      barColor: 'bg-rose-500'
    },
    {
      label: 'Humidity',
      value: `${readings.humidity}%`,
      status: 'High',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      progress: readings.humidity,
      icon: Droplets,
      barColor: 'bg-indigo-400'
    },
    {
      label: 'Rainfall (24h)',
      value: `${readings.rainfall24h} mm`,
      status: 'Caution',
      statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      progress: Math.min(100, (readings.rainfall24h / 20) * 100),
      icon: CloudRain,
      barColor: 'bg-cyan-400'
    },
    {
      label: 'Seismic Activity',
      value: readings.seismicActivity,
      status: 'Low Risk',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      progress: 20,
      icon: Activity,
      barColor: 'bg-emerald-400'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* RISK → REASON → ACTION Banner Rule in Bento Dark Navy Card */}
      <div className="p-5 rounded-2xl bg-[#0B192E] text-white shadow-lg border border-[#1E293B] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
              <ShieldAlert className="w-6 h-6 stroke-[2.2] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-red-500 text-white font-black text-[10px] tracking-wider uppercase">
                  ACTIVE HAZARD ADVISORY
                </span>
                <span className="text-xs font-bold text-red-300">
                  {criticalSector.name} — {criticalSector.hazardType}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">RISK</span>
                  <span className="font-extrabold text-red-400">{criticalSector.riskScore}/100 HIGH</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">REASON</span>
                  <span className="font-medium text-slate-200 truncate block">{criticalSector.reasonSummary}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1E293B] border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ACTION</span>
                  <span className="font-medium text-[#F27D26]">Inspect sector • Restrict access • Evacuate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectSector(criticalSector)}
              className="px-4 py-2.5 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
            >
              <span>Inspect Sector B-12</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAIChat}
              className="px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-white font-bold text-xs border border-slate-600 transition cursor-pointer"
            >
              Ask RockGuard AI
            </button>
          </div>
        </div>
      </div>

      {/* TOP 4 KPI CARDS - Bento White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: OVERALL RISK */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              OVERALL RISK
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-600">82</span>
              <span className="text-sm font-bold text-slate-400">/100</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold tracking-wider uppercase border border-red-200">
              HIGH RISK
            </span>
          </div>

          {/* Large Circular Risk Indicator */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-red-500"
                strokeDasharray="82, 100"
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <AlertTriangle className="w-6 h-6 text-red-500 absolute" />
          </div>
        </div>

        {/* KPI 2: AI PREDICTION */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              AI PREDICTION
            </span>
            <div className="text-3xl font-black text-[#F27D26] mb-1">87%</div>
            <p className="text-xs font-semibold text-slate-600">
              Rockfall likelihood in Next 48–72 hours
            </p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Highwall strain accelerating</span>
          </div>
        </div>

        {/* KPI 3: LAST PREDICTION */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              LAST PREDICTION
            </span>
            <div className="text-2xl font-black text-slate-900 mb-1">11 Aug 2026</div>
            <p className="text-sm font-bold text-[#F27D26] font-mono">22:14 IST</p>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated 4 minutes ago via Drone InSAR</span>
          </div>
        </div>

        {/* KPI 4: ACTIVE ALERTS */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              ACTIVE ALERTS
            </span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-red-600">03</span>
              <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                1 Critical
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Requires supervisor action</p>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="mt-3 text-xs font-bold text-[#F27D26] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MAIN 24H RISK CHART & LIVE SENSORS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Risk Analysis Line Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#F27D26]" />
                <span>Real-Time Risk Analysis & AI Predictions</span>
              </h3>
              <p className="text-xs text-slate-500">
                24-Hour Continuous Geotechnical & Rainfall Monitoring
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-red-600">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span>Risk Score</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#F27D26]">
                <span className="w-3 h-3 rounded-full bg-[#F27D26] inline-block" />
                <span>AI Prediction</span>
              </span>
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="w-3 h-0.5 bg-red-500 inline-block" />
                <span>Threshold (80)</span>
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f27d26" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f27d26" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '0.75rem',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'CRITICAL THRESHOLD', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
                <Area type="monotone" dataKey="riskScore" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#riskGradient)" name="Actual Risk Score" />
                <Area type="monotone" dataKey="aiPrediction" stroke="#f27d26" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#aiGradient)" name="AI Predictive Trajectory" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Readings List */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#F27D26]" />
              <span>Live Sensor Readings</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Jharia Telemetry</span>
          </div>

          <div className="space-y-3">
            {liveReadingsList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#F27D26]" />
                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{item.value}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.statusColor.replace('text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 'text-emerald-700 bg-emerald-50 border-emerald-200').replace('text-amber-400 bg-amber-500/10 border-amber-500/20', 'text-amber-700 bg-amber-50 border-amber-200').replace('text-rose-400 bg-rose-500/10 border-rose-500/20', 'text-red-700 bg-red-50 border-red-200')}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Level progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.barColor.replace('bg-amber-500', 'bg-[#F27D26]').replace('bg-rose-500', 'bg-red-500')}`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LOWER SECTION: RISK OVERVIEW MAP PREVIEW & RECENT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mine Risk Overview Sector Cards */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#F27D26]" />
                <span>Mine Risk Overview & Monitored Sectors</span>
              </h3>
              <p className="text-xs text-slate-500">Sector Status & Active Sensor Nodes</p>
            </div>

            <button
              onClick={() => onNavigate('map')}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F27D26] font-bold text-xs border border-orange-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Full 2D Risk Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectors.slice(0, 4).map((sector) => {
              const isCritical = sector.riskLevel === 'CRITICAL';
              const isWarning = sector.riskLevel === 'WARNING';
              const isMedium = sector.riskLevel === 'MEDIUM';

              const badgeStyle = isCritical
                ? 'bg-red-50 text-red-700 border-red-200'
                : isWarning
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : isMedium
                ? 'bg-orange-50 text-orange-700 border-orange-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={sector.id}
                  onClick={() => onSelectSector(sector)}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#F27D26] transition cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#F27D26] transition">
                        {sector.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{sector.zoneType}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${badgeStyle}`}>
                        {sector.riskScore}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    <span className="text-[#F27D26] font-semibold">Hazard:</span> {sector.hazardType}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                    <span>{sector.activeWorkers} Workers active</span>
                    <span>{sector.sensorsInstalled} Sensors online</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personnel Summary Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F27D26]" />
                <span>Personnel Summary</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
                {totalPersonnel} Total
              </span>
            </div>

            {/* Personnel Count Cards */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-700">{safeCount}</div>
                <div className="text-[10px] font-bold uppercase text-emerald-800 mt-1">Safe</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <div className="text-2xl font-black text-amber-700">{cautionCount}</div>
                <div className="text-[10px] font-bold uppercase text-amber-800 mt-1">Caution</div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="text-2xl font-black text-red-600">{emergencyCount}</div>
                <div className="text-[10px] font-bold uppercase text-red-800 mt-1">Emergency</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span>Active Safety Beacons</span>
                <span className="text-emerald-600 font-mono">100% Signal</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: '87%' }} />
                <div className="bg-amber-400 h-full" style={{ width: '10%' }} />
                <div className="bg-red-500 h-full" style={{ width: '3%' }} />
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('personnel')}
            className="w-full py-2.5 rounded-xl bg-[#0B192E] hover:bg-[#1E293B] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Track All Workers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RECENT ALERTS LIST */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#F27D26]" />
            <span>Recent Safety Alerts</span>
          </h3>

          <button
            onClick={() => onNavigate('alerts')}
            className="text-xs font-bold text-[#F27D26] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Alerts ({alerts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            const severityStyle = isCritical
              ? 'bg-red-50 text-red-700 border-red-200'
              : isWarning
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-orange-50 text-orange-700 border-orange-200';

            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${severityStyle}`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{alert.title}</span>
                    <span className="text-xs font-semibold text-[#F27D26]">({alert.sector})</span>
                  </div>
                  <p className="text-xs text-slate-600">{alert.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Sensor: {alert.sensorSource} • Timestamp: {alert.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'ACTIVE' ? (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#0B192E] hover:bg-[#1E293B] text-white text-xs font-bold transition cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{alert.status}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
