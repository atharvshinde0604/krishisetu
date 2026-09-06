import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LiveGovMandiFeed } from './LiveGovMandiFeed';
import { AuctionCountdown } from './AuctionCountdown';
import {
  ShoppingBag, Search, Filter, MapPin, DollarSign, Calendar, CheckCircle2,
  Clock, AlertTriangle, Building2, Phone, FileText, Send, X, ArrowUpRight,
  Sparkles, Layers, ShieldCheck, UserCheck, RefreshCw, XCircle, Award,
  CreditCard, Check, ShieldAlert, Flame, Zap, Plus
} from 'lucide-react';

export const BuyerPortal = ({ initialTab }) => {
  const {
    currentUser, crops, bids, auctions, currentPortalView, setCurrentPortalView,
    instantBuyFixedPrice, placeAuctionBid, addBid, cancelDeal, openCancellationModal,
    cancellationRequests, t, buyerProfile, updateBuyerProfile, verifyBuyerCorporate
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab || 'MARKETPLACE'); // 'MARKETPLACE' | 'MY_BIDS' | 'BUYER_PROFILE'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  // Modal / Sub-form state for Counter Bid
  const [bidModalCrop, setBidModalCrop] = useState(null);
  const [counterBidForm, setCounterBidForm] = useState({
    bidPrice: '',
    buyerAddress: (buyerProfile.companyName || 'Mahavira Spices') + ' Warehouse, Sector 19, Vashi, Navi Mumbai, Maharashtra',
    buyerCity: 'Vashi, Navi Mumbai',
    pickupDate: '2026-09-10'
  });

  // Custom Auction Bids State (auctionId -> customValue)
  const [customBidValues, setCustomBidValues] = useState({});

  // Confirmation Modal state for Placing a Counter-Bid
  const [pendingPlaceBid, setPendingPlaceBid] = useState(null);

  // Buyer Profile local state
  const [corpForm, setCorpForm] = useState({
    companyName: buyerProfile.companyName || 'Mahavira Spices & Foods Pvt Ltd',
    repName: buyerProfile.repName || 'Vikram Shah',
    email: buyerProfile.email || 'procurement@mahaviraspices.com',
    panNumber: buyerProfile.panNumber || 'ABCDE1234F',
    gstinNumber: buyerProfile.gstinNumber || '27AAACM1234F1Z5',
    apmcLicense: buyerProfile.apmcLicense || 'APMC-MH-NSK-99214'
  });

  const [isVerifyingCorp, setIsVerifyingCorp] = useState(false);
  const [unlockedFarmerDetails, setUnlockedFarmerDetails] = useState(null);

  const openBidModal = (crop) => {
    setBidModalCrop(crop);
    setCounterBidForm({
      ...counterBidForm,
      bidPrice: (crop.fixedPrice || crop.expectedPrice) + 50
    });
  };

  const handleCounterBidSubmitClick = (e) => {
    e.preventDefault();
    if (!bidModalCrop) return;

    setPendingPlaceBid({
      crop: bidModalCrop,
      bidPrice: counterBidForm.bidPrice,
      buyerAddress: counterBidForm.buyerAddress,
      buyerCity: counterBidForm.buyerCity,
      pickupDate: counterBidForm.pickupDate
    });
  };

  const confirmPlaceBidAction = () => {
    if (!pendingPlaceBid) return;

    addBid({
      cropId: pendingPlaceBid.crop.id,
      bidPrice: pendingPlaceBid.bidPrice,
      buyerAddress: pendingPlaceBid.buyerAddress,
      buyerCity: pendingPlaceBid.buyerCity,
      pickupDate: pendingPlaceBid.pickupDate
    });

    setPendingPlaceBid(null);
    setBidModalCrop(null);
  };

  const handleCorpProfileSave = (e) => {
    e.preventDefault();
    updateBuyerProfile(corpForm);
  };

  const handleCorpIdentityVerify = () => {
    setIsVerifyingCorp(true);
    setTimeout(() => {
      setIsVerifyingCorp(false);
      verifyBuyerCorporate(corpForm);
    }, 1400);
  };

  // Auction Quick Increment Handler
  const handleQuickIncrementBid = (auction, increment) => {
    const newBid = Number(auction.currentHighestBid) + Number(increment);
    placeAuctionBid(auction.id, newBid);
  };

  // Auction Custom Bid Submit Handler
  const handleCustomBidSubmit = (auction) => {
    const customBid = Number(customBidValues[auction.id]);
    if (!customBid || isNaN(customBid)) {
      alert('Please enter a valid bid amount.');
      return;
    }
    if (customBid <= Number(auction.currentHighestBid)) {
      alert(`Your bid must be strictly higher than the current highest bid (₹${auction.currentHighestBid}/Qtl).`);
      return;
    }
    placeAuctionBid(auction.id, customBid);
    setCustomBidValues({ ...customBidValues, [auction.id]: '' });
  };

  // Filter crops
  const filteredCrops = crops.filter((crop) => {
    const cropName = t[crop.nameKey] || crop.name;
    const cropVariety = t[crop.varietyKey] || crop.variety;
    const cropCategory = t[crop.categoryKey] || crop.category;
    const cropLocation = t[crop.farmerLocationKey] || crop.farmerLocation;

    const matchesSearch =
      cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cropVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cropLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || crop.categoryKey === selectedCategory || crop.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'ALL' || crop.farmerDistrict === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const buyerBids = bids;

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      
      {/* ======================================================== */}
      {/* 1. DUAL-ENGINE NAVIGATION BAR & TABS */}
      {/* ======================================================== */}
      <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8 shadow-inner sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Procurement Engine:</span>
            <div className="flex items-center space-x-2 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80">
              <button
                onClick={() => setCurrentPortalView('REGULAR')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                  currentPortalView === 'REGULAR'
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>🟢 Regular Marketplace (Fixed Price)</span>
              </button>

              <button
                onClick={() => setCurrentPortalView('AUCTION')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                  currentPortalView === 'AUCTION'
                    ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md ring-2 ring-amber-400/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>🔥 Live Auction Arena</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 hidden md:flex items-center space-x-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            <span>Direct B2B Procurement • Nodal Escrow Integration</span>
          </div>
        </div>
      </div>

      {/* Top Banner & Corporate Profile Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white pt-6 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                🏢 {t.buyerRoleLabel}
              </span>
              {buyerProfile.isCorporateVerified ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {t.corporateVerifiedBadge}
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {t.corporatePendingBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              {buyerProfile.companyName || 'Corporate Procurement'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {currentPortalView === 'REGULAR'
                ? 'Instant buyout of farmer harvests at guaranteed fixed rates with Escrow protection.'
                : 'Wholesale live bidding arena with custom increments and live countdown clocks.'}
            </p>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-lg gap-1">
            <button
              onClick={() => setActiveTab('MARKETPLACE')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'MARKETPLACE'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{currentPortalView === 'REGULAR' ? 'Fixed Marketplace' : 'Auction Lots'}</span>
            </button>

            <button
              onClick={() => setActiveTab('MY_BIDS')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'MY_BIDS'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t.myBids} ({buyerBids.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('BUYER_PROFILE')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'BUYER_PROFILE'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.corporateProfileTab}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Mandi Engine Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================================================== */}
          {/* 2. REAL-TIME GOV MANDI PRICE ENGINE SIDEBAR */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            <LiveGovMandiFeed />

            {/* Corporate Compliance Quick Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-xs space-y-2.5">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-100 pb-2">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                  B2B Escrow Rule
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                  1% APMC Cess
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                When using <strong className="text-slate-900">"Instant Buy Now"</strong> or winning an <strong className="text-slate-900">Auction</strong>, funds lock securely in the MahaAgri Nodal Account. Farmer contact information unlocks upon deposit confirmation.
              </p>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. REFACTORED TRANSACTION PORTS: MAIN AREA */}
          {/* ======================================================== */}
          <div className="lg:col-span-8">
            
            {/* ---------------------------------------------------- */}
            {/* TAB: CORPORATE KYC / BUYER PROFILE */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'BUYER_PROFILE' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-amber-600" />
                    {t.corporateProfileTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Verified GSTIN and APMC licenses enable institutional procurement and tax credit compliance.
                  </p>
                </div>

                <form onSubmit={handleCorpProfileSave} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        value={corpForm.companyName}
                        onChange={(e) => setCorpForm({ ...corpForm, companyName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Authorized Representative</label>
                      <input
                        type="text"
                        required
                        value={corpForm.repName}
                        onChange={(e) => setCorpForm({ ...corpForm, repName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Corporate GSTIN</label>
                      <input
                        type="text"
                        required
                        value={corpForm.gstinNumber}
                        onChange={(e) => setCorpForm({ ...corpForm, gstinNumber: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-mono font-bold uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">APMC Trader License</label>
                      <input
                        type="text"
                        required
                        value={corpForm.apmcLicense}
                        onChange={(e) => setCorpForm({ ...corpForm, apmcLicense: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Save Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleCorpIdentityVerify}
                      disabled={isVerifyingCorp}
                      className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isVerifyingCorp ? 'Verifying Corporate GSTIN...' : 'Verify Government Corporate Identity ✅'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TAB: MY SUBMITTED BIDS */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'MY_BIDS' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-amber-600" />
                  {t.myBids} ({buyerBids.length})
                </h2>

                {buyerBids.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-700">No Bids Placed Yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Browse the Marketplace to buy now or place bids.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                          <tr>
                            <th className="p-4">Crop Details</th>
                            <th className="p-4">Rate & Value</th>
                            <th className="p-4">Destination</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {buyerBids.map((bid) => {
                            const crop = crops.find((c) => c.id === bid.cropId);
                            const isAccepted = bid.status === 'ACCEPTED' || (crop && crop.acceptedBidId === bid.id);
                            const cropNameTitle = crop ? (t[crop.nameKey] || crop.name) : 'Crop Listing';

                            return (
                              <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-4">
                                  <span className="font-bold text-slate-900 block">{cropNameTitle}</span>
                                  <span className="text-slate-500 font-mono text-[11px]">{crop?.quantity} Quintals</span>
                                </td>

                                <td className="p-4">
                                  <span className="font-extrabold text-amber-700 text-sm">₹{bid.bidPrice}/Qtl</span>
                                  <span className="text-slate-400 block text-[10px]">
                                    Total: ₹{(bid.bidPrice * (crop?.quantity || 1)).toLocaleString('en-IN')}
                                  </span>
                                </td>

                                <td className="p-4">
                                  <span className="text-slate-800 font-medium block">{bid.buyerCity}</span>
                                  <span className="text-slate-500 text-[10px]">Target: {bid.pickupDate}</span>
                                </td>

                                <td className="p-4">
                                  {isAccepted ? (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Accepted (Escrow Locked 🔒)</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-semibold rounded-full text-[11px]">
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Pending Review</span>
                                    </span>
                                  )}
                                </td>

                                <td className="p-4 text-right space-x-2">
                                  {isAccepted && crop && (
                                    <button
                                      onClick={() => setUnlockedFarmerDetails({ crop, bid })}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                                    >
                                      Delivery Slip
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* ENGINE A: REGULAR MARKETPLACE (FIXED PRICE VIEW) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'MARKETPLACE' && currentPortalView === 'REGULAR' && (
              <div className="space-y-6">
                
                {/* Search & Filters */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Onion, Soyabean, Nashik, Pune..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                    >
                      <option value="ALL">All Categories</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Oilseeds">Oilseeds</option>
                      <option value="Fiber">Fiber</option>
                      <option value="Cereals">Cereals</option>
                    </select>

                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
                    >
                      <option value="ALL">All Districts</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Latur">Latur</option>
                      <option value="Yavatmal">Yavatmal</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>

                {/* Crop Listing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCrops.map((crop) => {
                    const cropBids = buyerBids.filter((b) => b.cropId === crop.id);
                    const isSoldAtFixedRate = crop.status === 'SOLD_FIXED' || crop.statusBadge?.includes('Sold at Fixed Rate');
                    const isAccepted = crop.status === 'DEAL_FINALIZED' || isSoldAtFixedRate;
                    const cropNameTitle = t[crop.nameKey] || crop.name;
                    const cropVarietyTitle = t[crop.varietyKey] || crop.variety;
                    const fixedPriceVal = crop.fixedPrice || crop.expectedPrice;
                    const pickupAddressVal = crop.farmAddress || 'Satana, Nashik District, Maharashtra';

                    return (
                      <div
                        key={crop.id}
                        className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all flex flex-col justify-between ${
                          isSoldAtFixedRate
                            ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:shadow-md'
                        }`}
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                            <img
                              src={crop.image}
                              alt={cropNameTitle}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex items-center space-x-2">
                              <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                {crop.grade}
                              </span>
                              <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                Fixed Rate
                              </span>
                            </div>

                            {/* Overlaid Status Badge */}
                            {isSoldAtFixedRate && (
                              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                                <span className="bg-emerald-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  <span>Sold at Fixed Rate ✅</span>
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-black text-slate-900 text-base">{cropNameTitle}</h3>
                                <p className="text-xs text-slate-500">{cropVarietyTitle}</p>
                              </div>
                              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                                {crop.quantity} Qtl
                              </span>
                            </div>

                            <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-semibold">Fixed Rate:</span>
                                <strong className="text-emerald-800 font-black text-base">₹{fixedPriceVal}/Qtl</strong>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 font-semibold">Total Valuation:</span>
                                <strong className="text-slate-900 font-bold">₹{(fixedPriceVal * crop.quantity).toLocaleString('en-IN')}</strong>
                              </div>
                              <div className="text-[11px] text-slate-500 pt-1 truncate">
                                📍 <span className="font-medium text-slate-700">{pickupAddressVal}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Instant Buy Now & Counter-Bid */}
                        <div className="p-5 pt-0 space-y-2">
                          {isAccepted ? (
                            <button
                              disabled
                              className="w-full py-2.5 bg-slate-200 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed"
                            >
                              Sold at Fixed Rate ✅ (Deal Locked)
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              {/* PROMINENT GREEN "INSTANT BUY NOW" BUTTON */}
                              <button
                                onClick={() => instantBuyFixedPrice(crop.id)}
                                className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center space-x-1.5"
                              >
                                <Zap className="w-4 h-4 text-yellow-300 shrink-0" />
                                <span>Instant Buy Now</span>
                              </button>

                              {/* Secondary Counter-Bid Button */}
                              <button
                                onClick={() => openBidModal(crop)}
                                className="py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center justify-center space-x-1"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Counter-Bid</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* ENGINE B: LIVE AUCTION ARENA VIEW (BUYER SIDE) */}
            {/* ---------------------------------------------------- */}
            {activeTab === 'MARKETPLACE' && currentPortalView === 'AUCTION' && (
              <div className="space-y-6">
                
                {/* Auction Arena Banner */}
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-amber-900/40 text-amber-200 border border-amber-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>Live Wholesale Competitive Bidding Room</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Live Wholesale Auction Arena</h2>
                    <p className="text-xs text-amber-100 mt-1">
                      Place live counter-bids or use instant increment modifiers to secure the highest bidder rank before clocks expire.
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-white/20 px-3 py-1.5 rounded-xl text-white">
                    {auctions.length} Ongoing Lots
                  </span>
                </div>

                {/* Auction Slots List */}
                <div className="space-y-6">
                  {auctions.map((auction) => {
                    const isLeading = auction.highestBidderName === (buyerProfile.companyName || currentUser?.name);

                    return (
                      <div
                        key={auction.id}
                        className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all ${
                          isLeading ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                        }`}
                      >
                        {/* Slot Header with Countdown */}
                        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={auction.image}
                              alt={auction.cropName}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-extrabold text-base text-white">{auction.cropName}</h3>
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                                  {auction.variety}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">
                                Lot Size: <strong className="text-white">{auction.quantity} Qtl</strong> • District: {auction.farmerDistrict}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end space-y-1">
                            <AuctionCountdown expiresAt={auction.expiresAt} />
                            <span className="text-[10px] text-slate-400">Time Remaining</span>
                          </div>
                        </div>

                        {/* Financial Metrics */}
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50 text-xs">
                          <div>
                            <span className="text-slate-400 block uppercase text-[10px] font-semibold">Reserve Base:</span>
                            <span className="font-bold text-slate-800 text-sm">₹{auction.reservePrice.toLocaleString('en-IN')}/Qtl</span>
                          </div>

                          <div>
                            <span className="text-emerald-700 block uppercase text-[10px] font-bold">Current Highest Bid:</span>
                            <span className="font-black text-emerald-800 text-xl">₹{auction.currentHighestBid.toLocaleString('en-IN')}/Qtl</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block uppercase text-[10px] font-semibold">Leading Bidder:</span>
                            <span className="font-bold text-slate-900 text-xs truncate block flex items-center space-x-1">
                              {isLeading && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                              <span>{auction.highestBidderName}</span>
                            </span>
                          </div>
                        </div>

                        {/* ============================================ */}
                        {/* 3. INTERACTIVE BIDDING CONSOLE PANEL */}
                        {/* ============================================ */}
                        <div className="p-5 bg-white space-y-4">
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
                              🎮 Interactive Wholesale Bidding Console
                            </span>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                              {/* Custom Digit Input Box */}
                              <div className="md:col-span-5 relative">
                                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">₹</span>
                                <input
                                  type="number"
                                  placeholder="Enter Custom Bid..."
                                  value={customBidValues[auction.id] || ''}
                                  onChange={(e) => setCustomBidValues({ ...customBidValues, [auction.id]: e.target.value })}
                                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                              </div>

                              <button
                                onClick={() => handleCustomBidSubmit(auction)}
                                className="md:col-span-3 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                              >
                                Submit Custom Bid
                              </button>

                              {/* Three Instant Increment Modifiers */}
                              <div className="md:col-span-4 flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleQuickIncrementBid(auction, 50)}
                                  className="flex-1 py-2 px-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center"
                                  title="Add ₹50/Qtl"
                                >
                                  +₹50/Qtl
                                </button>
                                <button
                                  onClick={() => handleQuickIncrementBid(auction, 100)}
                                  className="flex-1 py-2 px-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-400 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center"
                                  title="Add ₹100/Qtl"
                                >
                                  +₹100/Qtl
                                </button>
                                <button
                                  onClick={() => handleQuickIncrementBid(auction, 200)}
                                  className="flex-1 py-2 px-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center"
                                  title="Add ₹200/Qtl"
                                >
                                  +₹200/Qtl
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Recent Bids Feed */}
                          {auction.bidsHistory && auction.bidsHistory.length > 0 && (
                            <div className="pt-2 border-t border-slate-100">
                              <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Recent Bids Feed:</span>
                              <div className="flex flex-wrap gap-2">
                                {auction.bidsHistory.slice(0, 3).map((offer, i) => (
                                  <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono">
                                    <strong>₹{offer.amount}/Qtl</strong> ({offer.bidderName})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* COUNTER-BID SUB-MODAL */}
      {bidModalCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setBidModalCrop(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Submit Counter-Bid
                </h3>
                <p className="text-xs text-slate-500">
                  {bidModalCrop.name || t[bidModalCrop.nameKey]} ({bidModalCrop.quantity} Qtl)
                </p>
              </div>
            </div>

            <form onSubmit={handleCounterBidSubmitClick} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Counter-Bid Price (₹/Quintal)
                </label>
                <input
                  type="number"
                  min={100}
                  required
                  value={counterBidForm.bidPrice}
                  onChange={(e) => setCounterBidForm({ ...counterBidForm, bidPrice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Destination / Warehouse
                </label>
                <input
                  type="text"
                  required
                  value={counterBidForm.buyerAddress}
                  onChange={(e) => setCounterBidForm({ ...counterBidForm, buyerAddress: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Destination City
                  </label>
                  <input
                    type="text"
                    required
                    value={counterBidForm.buyerCity}
                    onChange={(e) => setCounterBidForm({ ...counterBidForm, buyerCity: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    required
                    value={counterBidForm.pickupDate}
                    onChange={(e) => setCounterBidForm({ ...counterBidForm, pickupDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-all"
              >
                Submit Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR COUNTER-BID */}
      {pendingPlaceBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-2 border-amber-500 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Confirm Counter-Bid Submission
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Binding Commercial Offer
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              Submit counter-offer of <strong className="text-slate-900">₹{pendingPlaceBid.bidPrice}/Qtl</strong> for {pendingPlaceBid.crop.quantity} Quintals (Total: ₹{(pendingPlaceBid.bidPrice * pendingPlaceBid.crop.quantity).toLocaleString('en-IN')})?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setPendingPlaceBid(null)}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                No, Review
              </button>

              <button
                onClick={confirmPlaceBidAction}
                className="w-1/2 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Yes, Submit Offer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNLOCKED FARMER DELIVERY DETAILS MODAL */}
      {unlockedFarmerDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border-2 border-emerald-500 animate-in zoom-in-95">
            <button
              onClick={() => setUnlockedFarmerDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Farmer Contact & Farm Pickup Slip
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Escrow Secured • Government Audit Compliance
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <strong className="text-slate-900">{unlockedFarmerDetails.crop.farmerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <strong className="text-emerald-700 font-mono">{unlockedFarmerDetails.crop.farmerPhone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Address:</span>
                <span className="text-slate-800 font-medium text-right max-w-xs">{unlockedFarmerDetails.crop.farmAddress || 'Nashik District'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <strong className="text-slate-900">{unlockedFarmerDetails.crop.quantity} Qtl</strong>
              </div>
            </div>

            <button
              onClick={() => setUnlockedFarmerDetails(null)}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
