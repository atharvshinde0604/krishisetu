import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShoppingBag, Globe, Bell, LogOut, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, language, setLanguage, t, notifications, dismissNotification } = useApp();
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & SIH Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white">{t.appName}</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                SIH26132
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{t.slogan}</p>
          </div>
        </div>

        {/* Center Role Indicator (if logged in) */}
        {currentUser && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            {currentUser.role === 'farmer' ? (
              <span className="flex items-center text-xs font-medium text-emerald-400">
                <Sprout className="w-4 h-4 mr-1.5" />
                {t.farmer}
              </span>
            ) : (
              <span className="flex items-center text-xs font-medium text-amber-400">
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                {t.buyer}
              </span>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-semibold">{currentUser.name}</span>
          </div>
        )}

        {/* Right Tools & Language Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <Globe className="w-3.5 h-3.5 ml-2 text-slate-400 hidden xs:block" />
            {(['EN', 'HI', 'MR']).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'EN' ? 'EN' : lang === 'HI' ? 'हिन्दी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Notifications Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                )}
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-200">Alerts & Live Activity</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">
                      {notifications.length} Active
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/50">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-400 text-center">No new notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-slate-700/30 flex items-start justify-between group">
                          <div>
                            <p className="text-xs text-slate-200">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                          <button
                            onClick={() => dismissNotification(notif.id)}
                            className="text-slate-500 hover:text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logout / Switch Role Button */}
          {currentUser && (
            <button
              onClick={logout}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-700/50 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
