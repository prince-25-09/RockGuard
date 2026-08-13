import React from 'react';
import {
  LayoutDashboard,
  Scan,
  Map,
  Bell,
  Users,
  Settings,
  LogOut,
  Shield,
  X
} from 'lucide-react';

export type PageView = 'overview' | 'scan' | 'map' | 'alerts' | 'personnel';

interface SidebarProps {
  activePage: PageView;
  onPageSelect: (page: PageView) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  activeAlertCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onPageSelect,
  onLogout,
  onOpenSettings,
  activeAlertCount,
  mobileOpen,
  onCloseMobile
}) => {
  const navItems: { id: PageView; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Image Upload & AI Scan', icon: Scan },
    { id: 'map', label: '2D Risk Map', icon: Map },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertCount },
    { id: 'personnel', label: 'Personnel Tracking', icon: Users }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B192E] text-white border-r border-[#1E293B] shadow-2xl select-none">
      {/* Top Branding Header */}
      <div className="p-6 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#F27D26] rounded-md flex items-center justify-center font-black text-white text-sm shadow-md">
            RG
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight leading-none text-white">
              RockGuard
            </h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
              Mine Safety Platform
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg bg-[#1E293B] text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onPageSelect(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm tracking-wide transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1E293B] text-white font-semibold'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F27D26]' : 'opacity-80'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-[#F27D26] text-white' : 'bg-red-500 text-white'
                }`}>
                  {item.badge < 10 ? `0${item.badge}` : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-6 border-t border-[#1E293B] bg-[#0B192E] space-y-4">
        {/* System Status Tag */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs text-slate-400 font-medium">System Online</span>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1E293B] hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium border border-red-500/20 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
