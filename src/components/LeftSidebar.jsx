import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShoppingBag, Globe, Home, TrendingUp, UserCheck, Settings, ArrowRightLeft, ShieldCheck, LogOut, Award, Landmark, CheckCircle2 } from 'lucide-react';

export const LeftSidebar = ({ currentView, setCurrentView }) => {
  const { currentUser, login, logout, language, setLanguage, t, farmerProfile, buyerProfile } = useApp();

  if (!currentUser) return null;

  const isFarmer = currentUser.role === 'farmer';
  const isVerified = isFarmer ? farmerProfile.isLandVerified : buyerProfile.isCorporateVerified;

  return (
    <aside className="w-full lg:w-72 bg-slate-900 text-white border-r border-slate-800 flex flex-col justify-between shrink-0 shadow-2xl z-30 min-h-screen">
      <div>
        
        {/* Brand & SIH Badge */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">{t.appName}</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SIH26132
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{t.slogan}</p>
            </div>
          </div>
        </div>

        {/* Current Active User & Verification Badge */}
        <div className="p-4 mx-3 my-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              isFarmer ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isFarmer ? `🌾 ${t.farmerRoleLabel}` : `🏢 ${t.buyerRoleLabel}`}
            </span>

            {isVerified ? (
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center shadow-sm">
                <CheckCircle2 className="w-3 h-3 mr-0.5" />
                VERIFIED
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                PENDING
              </span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-sm text-white truncate">{currentUser.name}</h3>
            <p className="text-[11px] text-slate-400 font-mono">{currentUser.phone}</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="px-3 space-y-1.5">
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Navigation & Controls
          </span>

          {/* Main Dashboard / Marketplace */}
          <button
            onClick={() => setCurrentView('MAIN')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentView === 'MAIN'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {isFarmer ? <Sprout className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            <span>{t.navDashboard}</span>
          </button>

          {/* Live Mandi Prices */}
          <button
            onClick={() => setCurrentView('MANDI')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentView === 'MANDI'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.navMandi}</span>
          </button>

          {/* Profile & Verification Tab */}
          <button
            onClick={() => setCurrentView('PROFILE')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentView === 'PROFILE'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <UserCheck className="w-4 h-4" />
              <span>{t.navProfile}</span>
            </div>
            {isVerified && <span className="w-2 h-2 bg-emerald-400 rounded-full" />}
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setCurrentView('SETTINGS')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              currentView === 'SETTINGS'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.navSettings}</span>
          </button>
        </nav>

      </div>

      {/* Footer Controls: Language Switcher & Quick Role Switcher */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        
        {/* Language Selection */}
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center">
            <Globe className="w-3.5 h-3.5 mr-1" />
            Language / भाषा Select
          </span>
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['EN', 'HI', 'MR']).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'EN' ? 'EN' : lang === 'HI' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>
        </div>

        {/* Role Quick Switch */}
        <div>
          <button
            onClick={() =>
              login(
                isFarmer ? 'buyer' : 'farmer',
                isFarmer ? '9422188990' : '9822014321',
                isFarmer ? 'Mahavira Spices Ltd' : 'Ramesh Patil'
              )
            }
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isFarmer ? t.switchToBuyer : t.switchToFarmer}</span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-2 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800/40 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t.logout}</span>
        </button>

      </div>
    </aside>
  );
};
