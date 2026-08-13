import React, { useState } from 'react';
import {
  Map,
  Search,
  Layers,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  RefreshCw,
  Radio,
  ArrowRight,
  Shield,
  X
} from 'lucide-react';
import { RiskSector } from '../types';

interface RiskMapPageProps {
  sectors: RiskSector[];
  selectedSector: RiskSector | null;
  onSelectSector: (sector: RiskSector) => void;
  onNavigateScan: () => void;
  onOpenAIChat: () => void;
}

export const RiskMapPage: React.FC<RiskMapPageProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
  onNavigateScan,
  onOpenAIChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapMode, setMapMode] = useState<'map' | 'satellite' | 'grid'>('map');

  const filteredSectors = sectors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hazardType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.zoneType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSector = selectedSector || sectors[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              High Risk Zones
            </span>
            <div className="text-2xl font-black text-red-600">08</div>
            <span className="text-[10px] text-red-600 font-semibold">Immediate inspection required</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Monitoring Points
            </span>
            <div className="text-2xl font-black text-[#F27D26]">24</div>
            <span className="text-[10px] text-[#F27D26] font-semibold">InSAR & Inclinometer Telemetry</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F27D26] flex items-center justify-center border border-orange-200">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Safe Zones
            </span>
            <div className="text-2xl font-black text-emerald-600">16</div>
            <span className="text-[10px] text-emerald-600 font-semibold">Stable Bedrock Terraces</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a sector or zone (e.g. Sector B-12)..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 focus:border-[#F27D26] rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex gap-1 text-xs font-semibold text-slate-700">
            <button
              onClick={() => setMapMode('map')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                mapMode === 'map' ? 'bg-[#F27D26] text-white font-bold' : 'hover:bg-slate-200'
              }`}
            >
              Topographic
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                mapMode === 'satellite' ? 'bg-[#F27D26] text-white font-bold' : 'hover:bg-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapMode('grid')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                mapMode === 'grid' ? 'bg-[#F27D26] text-white font-bold' : 'hover:bg-slate-200'
              }`}
            >
              InSAR Radar
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MINE TERRAIN MAP CONTAINER */}
      <div className="relative min-h-[500px] w-full rounded-2xl border border-slate-200 bg-[#0B192E] overflow-hidden shadow-sm flex flex-col justify-between p-6 text-white">
        {/* Map Background Layer Simulation */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-500"
          style={{
            backgroundImage: mapMode === 'satellite'
              ? `url('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1800&q=80')`
              : `radial-gradient(circle at 50% 50%, #1e293b 0%, #0b192e 100%)`
          }}
        />

        {/* Topo / Grid Contour Line Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Mine Open-Pit Terraced Contour Rings */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none stroke-[#F27D26]/40 fill-none" strokeWidth="1.5">
          <ellipse cx="50%" cy="50%" rx="42%" ry="38%" strokeDasharray="8 4" />
          <ellipse cx="50%" cy="50%" rx="32%" ry="28%" strokeDasharray="6 3" />
          <ellipse cx="50%" cy="50%" rx="22%" ry="18%" strokeDasharray="4 2" />
          <ellipse cx="50%" cy="50%" rx="12%" ry="9%" />
        </svg>

        {/* Map Header Legend */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#1E293B]/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#F27D26]" />
            <span className="text-xs font-bold text-white">Jharia Open-Pit Sector B Interactive 2D Terrain Map</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Risk
            </span>
            <span className="flex items-center gap-1 text-[#F27D26]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F27D26]" /> Medium
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Unknown
            </span>
          </div>
        </div>

        {/* SECTOR MARKERS PINS */}
        <div className="relative z-10 w-full h-[360px]">
          {filteredSectors.map((sector) => {
            const isSelected = activeSector.id === sector.id;
            const isCritical = sector.riskLevel === 'CRITICAL';
            const isWarning = sector.riskLevel === 'WARNING';
            const isMedium = sector.riskLevel === 'MEDIUM';

            const pinColor = isCritical
              ? 'bg-red-500 border-red-300 text-white'
              : isWarning
              ? 'bg-[#F27D26] border-orange-200 text-white'
              : isMedium
              ? 'bg-amber-500 border-amber-200 text-slate-950'
              : 'bg-emerald-500 border-emerald-200 text-slate-950';

            return (
              <div
                key={sector.id}
                onClick={() => onSelectSector(sector)}
                style={{
                  left: `${sector.coordinates.x}%`,
                  top: `${sector.coordinates.y}%`
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              >
                {/* Ping animation for critical pins */}
                {isCritical && (
                  <span className="animate-ping absolute -inset-1 rounded-full bg-red-500 opacity-75" />
                )}

                <div
                  className={`relative px-3 py-1.5 rounded-xl border-2 font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 ${pinColor} ${
                    isSelected ? 'scale-125 ring-4 ring-[#F27D26]/50 z-20' : 'hover:scale-110'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{sector.name}</span>
                  <span className="text-[10px] opacity-80">({sector.riskScore})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED SECTOR POPUP CARD */}
        {activeSector && (
          <div className="relative z-20 bg-[#1E293B]/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{activeSector.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/30">
                    Status: {activeSector.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{activeSector.zoneType} • Last Scan: {activeSector.lastScanTime}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-red-400">{activeSector.riskScore}/100</span>
                <span className="text-[10px] text-slate-400 block font-semibold">Risk Index</span>
              </div>
            </div>

            <p className="text-xs text-slate-200 bg-[#0B192E] p-2.5 rounded-lg border border-slate-700/80">
              <span className="text-[#F27D26] font-bold">Hazard:</span> {activeSector.hazardType} — {activeSector.reasonSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateScan}
                  className="px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#d86b1b] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>View Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenAIChat}
                  className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs border border-slate-600 transition cursor-pointer"
                >
                  Ask AI Copilot
                </button>
              </div>

              <span className="text-[11px] text-slate-300 font-mono">
                Lat: {activeSector.coordinates.lat || '23.7872'} | Lng: {activeSector.coordinates.lng || '86.4351'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
