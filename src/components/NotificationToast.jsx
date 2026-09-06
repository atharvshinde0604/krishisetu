import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationToast = () => {
  const { notifications, dismissNotification } = useApp();

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {notifications.slice(0, 3).map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-start justify-between space-x-3 animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start space-x-2.5">
            {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {n.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
            {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {n.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-semibold text-slate-100 leading-snug">{n.message}</p>
              <span className="text-[10px] text-slate-400 block mt-0.5">{n.timestamp}</span>
            </div>
          </div>

          <button
            onClick={() => dismissNotification(n.id)}
            className="text-slate-500 hover:text-white text-xs p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
