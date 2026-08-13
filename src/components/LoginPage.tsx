import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle, ArrowRight, Activity, Sparkles } from 'lucide-react';
import { loginWithGoogle, loginWithEmail } from '../lib/supabase';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('supervisor@rockguard.mine.gov.in');
  const [password, setPassword] = useState('RockGuard2026!');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginWithEmail(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.user) {
      onLoginSuccess(res.user);
    }
  };

  const handleGoogleSubmit = async () => {
    setGoogleLoading(true);
    setError(null);

    const res = await loginWithGoogle();
    setGoogleLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      // Demo/Fallback user trigger
      const demoUser: UserProfile = {
        id: 'google-usr-881',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@rockguard.mine.gov.in',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'Chief Geotechnical Engineer',
        sector: 'Jharia Open-Pit Mine'
      };
      onLoginSuccess(demoUser);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#070B19] font-sans">
      {/* Background Cinematic Open-Pit Mine Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 brightness-75"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=2000&q=80')`
        }}
      />

      {/* Dark Navy Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#050B1A]/95 via-[#0A1128]/85 to-[#0F172A]/80 backdrop-blur-[2px]" />

      {/* Subtle Atmospheric Grid & Industrial Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Main Glass-morphism Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-[#0A1128]/80 border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md text-white">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black shadow-lg shadow-orange-500/20 mb-4 ring-4 ring-orange-500/20">
            <Shield className="w-9 h-9 stroke-[2.2]" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Rock<span className="text-amber-500">Guard</span>
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-amber-400/90 mb-2">
            AI-Powered Early Warning for Mine & Slope Safety
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-slate-900/60 border border-slate-800 py-1 px-3 rounded-full mx-auto w-fit">
            <span className="text-emerald-400 font-bold">DETECT</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-bold">ASSESS</span>
            <span className="text-slate-500">•</span>
            <span className="text-orange-400 font-bold">ALERT</span>
            <span className="text-slate-500">•</span>
            <span className="text-rose-400 font-bold">PROTECT</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Continue with Google (Real OAuth & Demo fallback) */}
        <button
          type="button"
          onClick={handleGoogleSubmit}
          disabled={googleLoading}
          className="w-full h-11 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-100 font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.99] shadow-sm group"
        >
          {googleLoading ? (
            <Activity className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/60" />
          </div>
          <span className="relative bg-[#0A1128] px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            OR
          </span>
        </div>

        {/* Username/Password Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Work Email / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supervisor@rockguard.mine.gov.in"
                className="w-full h-11 pl-10 pr-4 bg-slate-900/90 border border-slate-700 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 bg-slate-900/90 border border-slate-700 focus:border-amber-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <Activity className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Secure Mine Safety Command Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
};
