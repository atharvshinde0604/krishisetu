import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ogdMandiApiPayload } from '../data/mockData';
import { RefreshCw, Search, Database, TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const LiveGovMandiFeed = () => {
  const { t } = useApp();
  const [feedData, setFeedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReSyncing, setIsReSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [syncStatus, setSyncStatus] = useState('CONNECTED'); // 'CONNECTED' | 'FALLBACK_CACHED'

  // useEffect replicating official Government of India OGD API payload fetch
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (isMounted) {
        setFeedData(ogdMandiApiPayload.records);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsLoading(false);
        setSyncStatus('CONNECTED');
      }
    }, 600);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Backup Data Override Handler: Re-Sync API Database Pipeline
  const handleReSyncPipeline = () => {
    setIsReSyncing(true);
    setTimeout(() => {
      // Simulate pipeline refresh and fallback load
      setFeedData(ogdMandiApiPayload.records);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsReSyncing(false);
      setSyncStatus('CONNECTED');
    }, 1200);
  };

  // Filter feed by Mandi or Commodity
  const filteredFeed = feedData.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      item.market.toLowerCase().includes(term) ||
      item.commodity.toLowerCase().includes(term) ||
      item.variety.toLowerCase().includes(term) ||
      (item.district && item.district.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header with Title and Pulsing Green Live Dot */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border-b border-slate-700/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            {/* Pulsing Green Live Indicator Dot */}
            <span className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm shadow-emerald-400"></span>
            </span>
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
              📡 Live Gov-API Feed Sync
            </h3>
          </div>

          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
            OGD 2026
          </span>
        </div>

        <p className="text-[11px] text-slate-300 mt-1 flex items-center justify-between">
          <span>Official APMC Maharashtra Feed</span>
          <span className="text-[10px] text-emerald-400 font-mono">Sync: {lastSyncTime}</span>
        </p>

        {/* Filter Input Box */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Filter by Mandi / Crop..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Feed Status Bar */}
      <div className="bg-emerald-50/80 px-4 py-1.5 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800 font-medium">
        <span className="flex items-center">
          <Database className="w-3 h-3 mr-1 text-emerald-600" />
          {syncStatus === 'CONNECTED' ? 'GoI OGD Server: Live API Active' : 'Cached Gateway Local'}
        </span>
        <span className="font-bold">{filteredFeed.length} Markets</span>
      </div>

      {/* Vertical Scannable Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[580px] divide-y divide-slate-100/80">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Establishing Open Govt API Connection...</span>
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs space-y-1">
            <p>No APMC markets match "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          filteredFeed.map((item) => (
            <div
              key={item.id}
              className="pt-2.5 first:pt-0 pb-1 hover:bg-slate-50/80 rounded-xl p-2 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{item.market}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {item.district}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 flex items-center space-x-1">
                    <span className="font-semibold text-slate-800">{item.commodity}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[10px]">{item.variety}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Arrivals: <span className="font-medium text-slate-600">{item.arrivals}</span>
                  </div>
                </div>

                {/* Modal Price in bold dark-green text */}
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Modal Price</div>
                  <div className="text-base font-extrabold text-emerald-800 tracking-tight">
                    ₹{item.modalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[9px] text-slate-500 font-medium">
                    Range: ₹{item.minPrice} - ₹{item.maxPrice}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Backup Data Override Button at Base */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
        <button
          onClick={handleReSyncPipeline}
          disabled={isReSyncing}
          className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isReSyncing ? 'animate-spin' : ''}`} />
          <span>{isReSyncing ? 'Synchronizing Pipeline...' : '🔄 Re-Sync API Database Pipeline'}</span>
        </button>
        <p className="text-[9px] text-slate-400 mt-1.5">
          Open Government Data (OGD) Platform • data.gov.in AGMARKNET
        </p>
      </div>
    </div>
  );
};
