import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Search, Filter, MapPin, Calculator, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MandiPricesView = () => {
  const { mandiPrices, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [trendFilter, setTrendFilter] = useState('ALL');

  // Calculator State
  const [calcQuantity, setCalcQuantity] = useState(100);
  const [selectedMandiId, setSelectedMandiId] = useState('mandi-1');

  const filteredMandiData = mandiPrices.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict = districtFilter === 'ALL' || item.district === districtFilter;
    const matchesTrend = trendFilter === 'ALL' || item.trend === trendFilter;

    return matchesSearch && matchesDistrict && matchesTrend;
  });

  const selectedMandi = mandiPrices.find((m) => m.id === selectedMandiId) || mandiPrices[0];
  const calculatedTotal = (calcQuantity * selectedMandi.modalPrice).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Real-Time APMC Price Discovery</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Live Mandi Prices Dashboard (Maharashtra)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Official APMC daily market rates for Onion, Soyabean, Cotton, Rice, Wheat & Tomato.
              </p>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Last Data Feed Sync</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-end">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Live (5 mins ago)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Table: APMC Prices */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Search Bar & Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Onion, Soyabean, Pune, Nashik..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                >
                  <option value="ALL">All Districts</option>
                  <option value="Nashik">Nashik</option>
                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Latur">Latur</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Yavatmal">Yavatmal</option>
                </select>

                <select
                  value={trendFilter}
                  onChange={(e) => setTrendFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                >
                  <option value="ALL">All Trends</option>
                  <option value="UP">Price Up 📈</option>
                  <option value="DOWN">Price Down 📉</option>
                  <option value="STABLE">Stable ➖</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="p-4">Commodity</th>
                      <th className="p-4">Mandi Market</th>
                      <th className="p-4 text-right">Min (₹/Qtl)</th>
                      <th className="p-4 text-right">Max (₹/Qtl)</th>
                      <th className="p-4 text-right">Modal Avg Rate</th>
                      <th className="p-4 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredMandiData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <span className="font-bold text-slate-900 block">{item.commodity}</span>
                          <span className="text-slate-400 text-[10px]">Arrivals: {item.arrivals} T</span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-800 font-semibold block">{item.mandi}</span>
                          <span className="text-slate-400 text-[10px]">{item.district} District</span>
                        </td>

                        <td className="p-4 text-right text-slate-600">
                          ₹{item.minPrice.toLocaleString('en-IN')}
                        </td>

                        <td className="p-4 text-right text-slate-600">
                          ₹{item.maxPrice.toLocaleString('en-IN')}
                        </td>

                        <td className="p-4 text-right">
                          <span className="font-extrabold text-emerald-800 text-sm">
                            ₹{item.modalPrice.toLocaleString('en-IN')}
                          </span>
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.trend === 'UP'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.trend === 'DOWN'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.trend === 'UP' && <ArrowUpRight className="w-3 h-3" />}
                            {item.trend === 'DOWN' && <ArrowDownRight className="w-3 h-3" />}
                            {item.trend === 'STABLE' && <Minus className="w-3 h-3" />}
                            <span>{item.changePercent}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Sidebar Widget: Fair Price Discovery Calculator */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Fair Price Calculator</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Select Benchmark APMC Mandi
                  </label>
                  <select
                    value={selectedMandiId}
                    onChange={(e) => setSelectedMandiId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {mandiPrices.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.commodity} - {m.mandi} (₹{m.modalPrice}/Qtl)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Harvest Quantity (Quintals)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
                  <span className="text-[11px] text-emerald-800 font-semibold block uppercase">
                    Estimated Direct Sales Revenue
                  </span>
                  <span className="text-2xl font-black text-emerald-900 block">
                    ₹{calculatedTotal}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Based on {selectedMandi.mandi} modal rate (₹{selectedMandi.modalPrice}/Qtl)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
