import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings, ShieldCheck, Lock, Landmark, CheckCircle2, Globe, Bell, Key, Database } from 'lucide-react';

export const SettingsView = () => {
  const { t, farmerProfile, buyerProfile, currentUser } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-600/30 rounded-2xl border border-emerald-500/40 text-emerald-300">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t.settingsTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {t.securityDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Government Audit Panel */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {t.govtComplianceHeader}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Contract Security</span>
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-bold text-slate-900 text-sm">{t.escrowAuditLabel}</p>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.activeStatus}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Land Authority</span>
                <Landmark className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-bold text-slate-900 text-sm">{t.landRecordSyncLabel}</p>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{farmerProfile.isLandVerified ? 'MahaBhulekh Authenticated' : t.enabledStatus}</span>
              </span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Mandi Connectivity</span>
                <Database className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="font-bold text-slate-900 text-sm">{t.apmcRegistryLabel}</p>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MSAMB Live Feed</span>
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
            <span>Protocol Version: SIH26132-MH-2026</span>
            <span className="font-semibold text-emerald-700">AES-256 Encrypted Gateway</span>
          </div>
        </div>

      </div>
    </div>
  );
};
