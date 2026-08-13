import React, { useState } from 'react';
import { Menu, MapPin, Bell, User, ChevronDown, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: UserProfile;
  activeAlertCount: number;
  onOpenMobileMenu: () => void;
  onNavigateAlerts: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  user,
  activeAlertCount,
  onOpenMobileMenu,
  onNavigateAlerts,
  onLogout
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 flex items-center justify-between text-slate-900 shadow-sm">
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Controls Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Coordinates Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
          <span>23°47'12"N 86°26'04"E</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#F27D26] font-semibold">Jharia Pit B-12</span>
        </div>

        {/* System Online Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>System Online</span>
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Mine Safety Alerts
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-200">
                  {activeAlertCount} Active
                </span>
              </div>

              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-red-700 mb-0.5">
                    <span>CRITICAL: Rockfall Risk</span>
                    <span>22:14</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Sector B-12 highwall cracking detected by AI drone scan.</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-700 mb-0.5">
                    <span>WARNING: High Rainfall</span>
                    <span>21:40</span>
                  </div>
                  <p className="text-[11px] text-slate-600">Sector C-04 reached 12.4mm rainfall, soil moisture 64%.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigateAlerts();
                }}
                className="w-full mt-2 py-2 rounded-xl bg-[#0B192E] hover:bg-[#1E293B] text-white text-xs font-bold transition text-center cursor-pointer"
              >
                View All Alert Records
              </button>
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center shrink-0">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#F27D26]" />
              )}
            </div>

            <div className="text-left hidden lg:block pr-1">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-[#F27D26] font-semibold">
                {user.role}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-slate-900">
              <div className="p-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <p className="text-[10px] text-[#F27D26] font-semibold mt-1">{user.role}</p>
              </div>

              <div className="pt-2 space-y-1">
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 text-xs font-bold transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
