import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, PageView, RiskSector, ImageScanResult } from './types';
import {
  INITIAL_SENSOR_READINGS,
  RISK_TREND_DATA,
  MINE_SECTORS,
  INITIAL_ALERTS,
  INITIAL_PERSONNEL
} from './data/mockData';
import { getCurrentUser, logoutUser } from './lib/supabase';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ImageScanPage } from './components/ImageScanPage';
import { RiskMapPage } from './components/RiskMapPage';
import { AlertManagementPage } from './components/AlertManagementPage';
import { PersonnelTrackingPage } from './components/PersonnelTrackingPage';
import { AIChatbox } from './components/AIChatbox';
import { SettingsModal } from './components/SettingsModal';
import { Bot } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [activePage, setActivePage] = useState<PageView>('overview');

  // Application State
  const [readings] = useState(INITIAL_SENSOR_READINGS);
  const [trendData] = useState(RISK_TREND_DATA);
  const [sectors, setSectors] = useState<RiskSector[]>(MINE_SECTORS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [personnel] = useState(INITIAL_PERSONNEL);
  const [selectedSector, setSelectedSector] = useState<RiskSector | null>(MINE_SECTORS[0]);
  const [latestScanResult, setLatestScanResult] = useState<ImageScanResult | null>(null);

  // UI Modals & Drawers
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const existingUser = await getCurrentUser();
      if (existingUser) {
        setUser(existingUser);
      }
      setLoadingUser(false);
    }
    loadSession();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'RESOLVED' } : a))
    );
  };

  const handleSelectSector = (sec: RiskSector) => {
    setSelectedSector(sec);
    setActivePage('map');
  };

  const activeAlertCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#070B19] flex items-center justify-center text-white font-sans">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black mx-auto animate-pulse shadow-lg shadow-orange-500/20">
            <span className="text-xl">RG</span>
          </div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Initializing RockGuard Mine Safety Platform...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, render the full-screen login page
  if (!user) {
    return <LoginPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  // Page title mapper
  const pageTitles: Record<PageView, { title: string; subtitle: string }> = {
    overview: {
      title: 'Mine Safety Dashboard',
      subtitle: 'Real-time hazard monitoring, AI predictions & sensor telemetry'
    },
    scan: {
      title: 'Image Upload & AI Scan',
      subtitle: 'AI-powered visual hazard detection for mine slopes & highwalls'
    },
    map: {
      title: '2D Risk Map',
      subtitle: 'Interactive mine terrain, sector hazards & monitoring nodes'
    },
    alerts: {
      title: 'Alert Management',
      subtitle: 'Early warning dispatches, acknowledgements & field protocols'
    },
    personnel: {
      title: 'Personnel Safety',
      subtitle: 'Live worker beacon tracking, vitals & hazard zone alerts'
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 font-sans flex flex-col antialiased">
      {/* Global Fixed Dark Navy Sidebar */}
      <Sidebar
        activePage={activePage}
        onPageSelect={(page) => setActivePage(page)}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsOpen(true)}
        activeAlertCount={activeAlertCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <Header
          title={pageTitles[activePage].title}
          subtitle={pageTitles[activePage].subtitle}
          user={user}
          activeAlertCount={activeAlertCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigateAlerts={() => setActivePage('alerts')}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views with Fade/Slide Animations */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activePage === 'overview' && (
                <OverviewDashboard
                  readings={readings}
                  trendData={trendData}
                  sectors={sectors}
                  alerts={alerts}
                  personnel={personnel}
                  onNavigate={(page) => setActivePage(page)}
                  onSelectSector={handleSelectSector}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                  onOpenAIChat={() => setAiChatOpen(true)}
                />
              )}

              {activePage === 'scan' && (
                <ImageScanPage
                  onScanCompleted={(res) => setLatestScanResult(res)}
                  onOpenAIChat={() => setAiChatOpen(true)}
                />
              )}

              {activePage === 'map' && (
                <RiskMapPage
                  sectors={sectors}
                  selectedSector={selectedSector}
                  onSelectSector={(sec) => setSelectedSector(sec)}
                  onNavigateScan={() => setActivePage('scan')}
                  onOpenAIChat={() => setAiChatOpen(true)}
                />
              )}

              {activePage === 'alerts' && (
                <AlertManagementPage
                  alerts={alerts}
                  onAcknowledgeAlert={handleAcknowledgeAlert}
                  onResolveAlert={handleResolveAlert}
                  onOpenAIChat={() => setAiChatOpen(true)}
                />
              )}

              {activePage === 'personnel' && (
                <PersonnelTrackingPage
                  personnel={personnel}
                  onOpenAIChat={() => setAiChatOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating RockGuard AI Floating Trigger Button */}
      <button
        onClick={() => setAiChatOpen(!aiChatOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black shadow-2xl shadow-orange-500/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-amber-500/20"
        title="Open RockGuard AI Copilot"
      >
        <Bot className="w-6 h-6" />
        <span className="hidden sm:inline text-xs font-black tracking-wider uppercase">
          RockGuard AI
        </span>
      </button>

      {/* RockGuard AI Copilot Chatbox Drawer */}
      <AIChatbox
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        contextData={{
          riskScore: selectedSector?.riskScore || 82,
          riskLevel: selectedSector?.riskLevel || 'CRITICAL',
          sector: selectedSector?.name || 'Sector B-12',
          hazardType: selectedSector?.hazardType || 'Rockfall',
          rainfall: readings.rainfall24h,
          soilMoisture: readings.soilMoisture,
          seismic: readings.seismicActivity,
          displacement: readings.slopeDisplacementRate || 4.2,
          activeAlertsCount: activeAlertCount,
          personnelEmergency: personnel.filter((p) => p.status === 'EMERGENCY').length,
          personnelCaution: personnel.filter((p) => p.status === 'CAUTION').length,
          latestScanResult
        }}
      />

      {/* System Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
