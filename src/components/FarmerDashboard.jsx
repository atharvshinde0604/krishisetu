import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { districtsAndTalukas } from '../data/mockData';
import { LiveGovMandiFeed } from './LiveGovMandiFeed';
import { AuctionCountdown } from './AuctionCountdown';
import {
  Sprout, PlusCircle, Layers, TrendingUp, MapPin, DollarSign, Image, Mic,
  ShieldAlert, CheckCircle2, Lock, Eye, AlertCircle, Phone, Building2,
  Calendar, FileText, ChevronRight, Sparkles, UserCheck, ShieldCheck,
  RefreshCw, XCircle, Landmark, Award, AlertTriangle, Check, X, Flame, Clock, Trash2
} from 'lucide-react';

export const FarmerDashboard = ({ initialTab }) => {
  const {
    currentUser, crops, bids, auctions, currentPortalView, setCurrentPortalView,
    addCrop, acceptBid, cancelDeal, openCancellationModal, cancellationRequests,
    mandiPrices, t, farmerProfile, updateFarmerProfile, verifyFarmerLand,
    deleteCrop, declineBid, createAuction, openProofOfRealityModal
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab || 'MY_LISTINGS'); // 'MY_LISTINGS' | 'CREATE_LISTING' | 'FARMER_PROFILE'
  const [activeAuctionTab, setActiveAuctionTab] = useState('AUCTION_LIST'); // 'AUCTION_LIST' | 'CREATE_AUCTION'

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Confirmation Modal state for Accepting a Bid
  const [pendingAcceptBid, setPendingAcceptBid] = useState(null);

  // Decline Bid Popover State
  const [decliningBidId, setDecliningBidId] = useState(null);
  const [declineReason, setDeclineReason] = useState('Price below target');

  // Crop Form State (Fixed Price)
  const [cropForm, setCropForm] = useState({
    name: 'Nashik Red Onion',
    variety: 'Garwa (Red Export Grade)',
    grade: 'Grade A',
    quantity: 100,
    expectedPrice: 2350,
    fixedPrice: 2350,
    farmAddress: 'Gat No. 74/2A, Satana Road, Baglan, Nashik, Maharashtra - 423301',
    farmerLocation: 'Satana Village, Nashik District',
    farmerDistrict: 'Nashik',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
  });

  const [imagePreview, setImagePreview] = useState(cropForm.image);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Auction Upload Portal Form State
  const [auctionForm, setAuctionForm] = useState({
    cropName: 'Export Grade Lasalgaon Onion Lot',
    variety: 'Nashik Red Super Grade',
    quantity: 200,
    reservePrice: 2100,
    durationHours: 4,
    pickupAddress: 'Gat No. 74/2A, Satana Road, Baglan, Nashik, Maharashtra - 423301',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80'
  });

  // Farmer Profile Form local state
  const [profileForm, setProfileForm] = useState({
    fullName: farmerProfile.fullName || 'Ramesh Maruti Patil',
    phone: farmerProfile.phone || '9822014321',
    bankAccount: farmerProfile.bankAccount || '918237465012',
    ifscCode: farmerProfile.ifscCode || 'SBIN0001234',
    district: farmerProfile.district || 'Nashik',
    taluka: farmerProfile.taluka || 'Satana (Baglan)',
    village: farmerProfile.village || 'Satana',
    gutNumber: farmerProfile.gutNumber || '74/2A'
  });

  const [isVerifyingLand, setIsVerifyingLand] = useState(false);

  const presetCrops = [
    { nameKey: 'crop1Name', varietyKey: 'crop1Variety', price: 2350, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop2Name', varietyKey: 'crop2Variety', price: 4750, image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop3Name', varietyKey: 'crop3Variety', price: 6800, image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80' },
    { nameKey: 'crop5Name', varietyKey: 'crop5Variety', price: 1850, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleSelectPreset = (preset) => {
    setCropForm({
      ...cropForm,
      name: t[preset.nameKey] || preset.nameKey,
      variety: t[preset.varietyKey] || preset.varietyKey,
      expectedPrice: preset.price,
      fixedPrice: preset.price,
      image: preset.image
    });
    setImagePreview(preset.image);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setCropForm({ ...cropForm, image: url });
    }
  };

  const handleVoiceAssistantMock = () => {
    setIsVoiceListening(true);
    setTimeout(() => {
      setIsVoiceListening(false);
      setCropForm({
        ...cropForm,
        name: t['crop2Name'] || 'Latur Yellow Soyabean',
        variety: t['crop2Variety'] || 'JS-335 Grade A',
        quantity: 150,
        expectedPrice: 4800,
        fixedPrice: 4800,
        farmAddress: 'Plot 18, Ausa Agro Corridor, Latur, Maharashtra - 413520',
        farmerLocation: t['locAusa'] || 'Latur District Farm'
      });
      setImagePreview('https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=600&q=80');
    }, 1500);
  };

  const handleCropSubmit = (e) => {
    e.preventDefault();
    addCrop({
      ...cropForm,
      quantity: Number(cropForm.quantity),
      expectedPrice: Number(cropForm.expectedPrice),
      fixedPrice: Number(cropForm.fixedPrice || cropForm.expectedPrice),
      farmAddress: cropForm.farmAddress || `${farmerProfile.village || 'Satana'}, ${farmerProfile.district || 'Nashik'}`
    });
    setActiveTab('MY_LISTINGS');
  };

  const handleAuctionSubmit = (e) => {
    e.preventDefault();
    createAuction(auctionForm);
    setActiveAuctionTab('AUCTION_LIST');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateFarmerProfile(profileForm);
  };

  const handleMahaBhulekhVerification = () => {
    setIsVerifyingLand(true);
    setTimeout(() => {
      setIsVerifyingLand(false);
      verifyFarmerLand(profileForm);
    }, 1400);
  };

  const confirmAcceptBidAction = () => {
    if (!pendingAcceptBid) return;
    acceptBid(pendingAcceptBid.id);
    setPendingAcceptBid(null);
  };

  const handleConfirmDeclineBid = (cropId, bidId) => {
    declineBid(cropId, bidId, declineReason);
    setDecliningBidId(null);
  };

  const farmerCrops = crops;
  const availableTalukas = districtsAndTalukas[profileForm.district] || ['Satana (Baglan)', 'Malegaon', 'Niphad'];

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      
      {/* ======================================================== */}
      {/* 1. DUAL-ENGINE NAVIGATION BAR & TABS */}
      {/* ======================================================== */}
      <div className="bg-slate-900 border-b border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8 shadow-inner sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Trade Engine:</span>
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
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span>Dual-Engine Gateway • Verified APMC Compliance</span>
          </div>
        </div>
      </div>

      {/* Top Banner & Quick Stats */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white pt-6 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                🌾 {t.farmerRoleLabel}
              </span>
              {farmerProfile.isLandVerified ? (
                <span className="bg-emerald-500 text-slate-950 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  {t.landVerifiedBadge}
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  {t.landPendingBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 text-white">
              {farmerProfile.fullName || currentUser?.name || 'Ramesh Patil'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
              {currentPortalView === 'REGULAR'
                ? 'Fixed-rate direct farm listings with proof-of-reality contract protection.'
                : 'Wholesale dynamic bidding room with live ticking countdown timers.'}
            </p>
          </div>

          {/* Action Tabs for Regular Engine */}
          {currentPortalView === 'REGULAR' ? (
            <div className="flex flex-wrap items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-lg gap-1">
              <button
                onClick={() => setActiveTab('MY_LISTINGS')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'MY_LISTINGS'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{t.myListings} ({farmerCrops.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('CREATE_LISTING')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'CREATE_LISTING'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.createListing}</span>
              </button>

              <button
                onClick={() => setActiveTab('FARMER_PROFILE')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'FARMER_PROFILE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{t.farmerProfileTab}</span>
              </button>
            </div>
          ) : (
            /* Action Tabs for Auction Engine */
            <div className="flex flex-wrap items-center bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-lg gap-1">
              <button
                onClick={() => setActiveAuctionTab('AUCTION_LIST')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeAuctionTab === 'AUCTION_LIST'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Active Auctions ({auctions.length})</span>
              </button>

              <button
                onClick={() => setActiveAuctionTab('CREATE_AUCTION')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeAuctionTab === 'CREATE_AUCTION'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Launch Auction Slot</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout with Mandi Ticker Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================================================== */}
          {/* 2. REAL-TIME GOV MANDI PRICE ENGINE SIDEBAR */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Gov-API Feed Sync Component */}
            <LiveGovMandiFeed />

            {/* Land Verification Quick Card */}
            <div className={`rounded-2xl p-5 border shadow-sm transition-all ${
              farmerProfile.isLandVerified
                ? 'bg-emerald-950/90 text-white border-emerald-500/60'
                : 'bg-amber-950/80 text-white border-amber-500/40'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  farmerProfile.isLandVerified ? 'bg-emerald-800/80 text-emerald-300' : 'bg-amber-800/80 text-amber-300'
                }`}>
                  {farmerProfile.isLandVerified ? <Award className="w-6 h-6" /> : <Landmark className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {farmerProfile.isLandVerified ? t.landVerifiedBadge : t.landPendingBadge}
                  </h4>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    {farmerProfile.isLandVerified
                      ? '7/12 Land details authenticated via Maharashtra MahaBhulekh Portal. High trust badge assigned to crop listings.'
                      : 'Verify your 7/12 land records to display government verified seller status to corporate buyers.'}
                  </p>
                  {!farmerProfile.isLandVerified && (
                    <button
                      onClick={() => {
                        setCurrentPortalView('REGULAR');
                        setActiveTab('FARMER_PROFILE');
                      }}
                      className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow transition-all"
                    >
                      {t.fetchVerifyLandBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* 3. REFACTORED TRANSACTION PORTS: MAIN AREA */}
          {/* ======================================================== */}
          <div className="lg:col-span-8">
            
            {/* ---------------------------------------------------- */}
            {/* ENGINE A: REGULAR MARKETPLACE (FIXED PRICE) */}
            {/* ---------------------------------------------------- */}
            {currentPortalView === 'REGULAR' && (
              <>
                {/* SUB-VIEW 1: FARMER PROFILE & 7/12 */}
                {activeTab === 'FARMER_PROFILE' && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
                    <div className="border-b border-slate-100 pb-4 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center">
                          <UserCheck className="w-5 h-5 mr-2 text-emerald-600" />
                          {t.farmerProfileTitle}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Direct integration with Maharashtra Land Records System (MahaBhulekh 7/12)
                        </p>
                      </div>
                      {farmerProfile.isLandVerified ? (
                        <span className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center shadow">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          {t.landVerifiedBadge}
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-full flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1.5 text-amber-600" />
                          {t.landPendingBadge}
                        </span>
                      )}
                    </div>

                    {farmerProfile.isLandVerified && (
                      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-emerald-500/50 space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
                          <div className="flex items-center space-x-2">
                            <Award className="w-6 h-6 text-amber-300" />
                            <span className="font-extrabold text-sm text-white uppercase tracking-wider">
                              MahaBhulekh Government Verified Land Record
                            </span>
                          </div>
                          <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                            7/12 AUTHENTICATED
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                            <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                              Ownership Record
                            </span>
                            <p className="font-bold text-white text-sm">{t.ownerNameLabel}</p>
                            <p className="text-[11px] text-slate-300 mt-0.5">{farmerProfile.fullName}</p>
                          </div>

                          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                            <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                              Authenticated Area
                            </span>
                            <p className="font-bold text-amber-300 text-sm">{t.landAreaLabel}</p>
                            <p className="text-[11px] text-slate-300 mt-0.5">Gut No: {farmerProfile.gutNumber || '74/2A'}</p>
                          </div>

                          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-emerald-800/50">
                            <span className="text-[10px] text-emerald-300 uppercase block font-semibold mb-1">
                              Crop Registration
                            </span>
                            <p className="font-bold text-white text-sm">{t.registeredCropLabel}</p>
                            <p className="text-[11px] text-emerald-400 mt-0.5">Kharif/Rabi Season</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleProfileSave} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            {t.fullName}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            {t.phoneNumber}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            {t.bankAccount}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.bankAccount}
                            onChange={(e) => setProfileForm({ ...profileForm, bankAccount: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            {t.ifscCode}
                          </label>
                          <input
                            type="text"
                            required
                            value={profileForm.ifscCode}
                            onChange={(e) => setProfileForm({ ...profileForm, ifscCode: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* MahaBhulekh Land Fetcher */}
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                          <Landmark className="w-5 h-5 text-emerald-700" />
                          <h3 className="font-bold text-slate-900 text-sm">{t.mahaBhulekhHeader}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                              {t.districtLabel}
                            </label>
                            <select
                              value={profileForm.district}
                              onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                              {Object.keys(districtsAndTalukas).map((d) => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                              {t.talukaLabel}
                            </label>
                            <select
                              value={profileForm.taluka}
                              onChange={(e) => setProfileForm({ ...profileForm, taluka: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                              {availableTalukas.map((tName) => (
                                <option key={tName} value={tName}>{tName}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                              {t.villageLabel}
                            </label>
                            <input
                              type="text"
                              value={profileForm.village}
                              onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                              {t.gutNumberLabel}
                            </label>
                            <input
                              type="text"
                              value={profileForm.gutNumber}
                              onChange={(e) => setProfileForm({ ...profileForm, gutNumber: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={handleMahaBhulekhVerification}
                            disabled={isVerifyingLand}
                            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <RefreshCw className={`w-4 h-4 ${isVerifyingLand ? 'animate-spin' : ''}`} />
                            <span>{isVerifyingLand ? t.verifyingStatus : t.fetchVerifyLandBtn}</span>
                          </button>
                          <span className="text-[11px] text-slate-500">Government Record Verification Gateway</span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-all"
                      >
                        {t.saveDetailsBtn}
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 2: CREATE FIXED-PRICE CROP LISTING */}
                {activeTab === 'CREATE_LISTING' && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 flex items-center">
                        <PlusCircle className="w-5 h-5 mr-2 text-emerald-600" />
                        {t.createListing} (Fixed Price Engine)
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        List harvested crops with explicit farm pickup address and fixed unit rate for instant buyer checkout.
                      </p>
                    </div>

                    {/* Presets */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-700 block mb-2">⚡ Quick Presets:</span>
                      <div className="flex flex-wrap gap-2">
                        {presetCrops.map((preset) => (
                          <button
                            key={preset.nameKey}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className="px-3 py-1.5 bg-white border border-slate-300 hover:border-emerald-500 rounded-lg text-xs font-semibold text-slate-800 transition-all flex items-center space-x-1.5"
                          >
                            <span>{t[preset.nameKey]}</span>
                            <span className="text-emerald-700 font-bold">₹{preset.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleCropSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Crop Name
                          </label>
                          <input
                            type="text"
                            value={cropForm.name}
                            onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. Nashik Red Onion"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Variety / Quality Grade
                          </label>
                          <input
                            type="text"
                            value={cropForm.variety}
                            onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g. Garwa Grade A"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Quantity (Quintals)
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={cropForm.quantity}
                            onChange={(e) => setCropForm({ ...cropForm, quantity: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Fixed Price per Quintal (₹/Qtl)
                          </label>
                          <input
                            type="number"
                            min={100}
                            value={cropForm.fixedPrice}
                            onChange={(e) => setCropForm({ ...cropForm, fixedPrice: e.target.value, expectedPrice: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Farm Pickup Address (Mandatory for Logistics)
                        </label>
                        <input
                          type="text"
                          value={cropForm.farmAddress}
                          onChange={(e) => setCropForm({ ...cropForm, farmAddress: e.target.value })}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500"
                          placeholder="e.g. Gat No. 74/2A, Satana Road, Baglan, Nashik, Maharashtra - 423301"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <Sprout className="w-5 h-5" />
                        <span>Publish Fixed-Price Listing</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* SUB-VIEW 3: MY LISTINGS & CANCELLATION MATRIX */}
                {activeTab === 'MY_LISTINGS' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900 flex items-center">
                        <Layers className="w-5 h-5 mr-2 text-emerald-600" />
                        Fixed-Price Farm Asset Ledger ({farmerCrops.length})
                      </h2>
                      <span className="text-xs text-slate-500">
                        Strict listing layout & 3-path cancellation matrix
                      </span>
                    </div>

                    {farmerCrops.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-700">No Listings In Ledger</h3>
                        <button
                          onClick={() => setActiveTab('CREATE_LISTING')}
                          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow"
                        >
                          + Create First Listing
                        </button>
                      </div>
                    ) : (
                      farmerCrops.map((crop) => {
                        const cropBids = bids.filter((b) => b.cropId === crop.id && b.status !== 'DECLINED');
                        const pendingBids = cropBids.filter((b) => b.status === 'PENDING');
                        const acceptedBid = bids.find((b) => b.id === crop.acceptedBidId);
                        const isAccepted = crop.status === 'DEAL_FINALIZED' || crop.status === 'SOLD_FIXED';
                        const isCancelRequested = crop.status === 'CANCEL_REQUESTED';
                        const isCancelPending = crop.status === 'CANCEL_PENDING';
                        const isDisputed = crop.status === 'DISPUTED';
                        const isSoldAtFixedRate = crop.status === 'SOLD_FIXED' || crop.statusBadge?.includes('Sold at Fixed Rate');

                        const cropNameTitle = t[crop.nameKey] || crop.name;
                        const cropVarietyTitle = t[crop.varietyKey] || crop.variety;
                        const fixedPriceVal = crop.fixedPrice || crop.expectedPrice;
                        const pickupAddressVal = crop.farmAddress || 'Gat No. 74/2A, Satana Road, Baglan, Nashik, Maharashtra - 423301';

                        return (
                          <div
                            key={crop.id}
                            className={`bg-white rounded-2xl overflow-hidden border transition-all ${
                              isSoldAtFixedRate
                                ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                                : isAccepted
                                ? 'border-emerald-400 shadow-sm'
                                : 'border-slate-200 shadow-sm'
                            }`}
                          >
                            {/* Strict Listing Layout Header */}
                            <div className="p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-start space-x-4 min-w-0">
                                <img
                                  src={crop.image}
                                  alt={cropNameTitle}
                                  className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-2 flex-wrap">
                                    <h3 className="text-lg font-black text-slate-900 truncate">{cropNameTitle}</h3>
                                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      {cropVarietyTitle}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                                    <div>
                                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Quantity:</span>
                                      <strong className="text-slate-900 font-bold text-sm">{crop.quantity} Quintals</strong>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fixed Rate:</span>
                                      <strong className="text-emerald-800 font-extrabold text-sm">₹{fixedPriceVal}/Qtl</strong>
                                    </div>
                                    <div className="sm:col-span-1">
                                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Farm Pickup Address:</span>
                                      <span className="text-slate-700 font-medium text-xs truncate block" title={pickupAddressVal}>
                                        📍 {pickupAddressVal}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Status Badges */}
                              <div className="shrink-0 flex flex-col items-end space-y-2">
                                {isSoldAtFixedRate ? (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black shadow-md">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    <span>Sold at Fixed Rate ✅</span>
                                  </span>
                                ) : isCancelRequested ? (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full text-xs font-black animate-pulse">
                                    <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                                    <span>Cancellation Requested - Awaiting Buyer Response</span>
                                  </span>
                                ) : isAccepted ? (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-700 text-white rounded-full text-xs font-bold shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                    <span>Contract Accepted (Escrow Locked 🔒)</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-semibold">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1" />
                                    <span>Open for Instant Buy & Offers ({cropBids.length})</span>
                                  </span>
                                )}

                                {/* ============================================ */}
                                {/* 4. FARMER-SIDE CANCELLATION MATRIX ROUTING */}
                                {/* ============================================ */}
                                <div className="flex items-center space-x-2 pt-1">
                                  {/* ROUTING A: 0 Bids -> Delete Listing Button */}
                                  {cropBids.length === 0 && !isAccepted && !isCancelRequested && (
                                    <button
                                      onClick={() => {
                                        if (window.confirm(`Are you sure you want to delete listing for "${cropNameTitle}"? This will execute local data deletion.`)) {
                                          deleteCrop(crop.id);
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>Delete Listing</span>
                                    </button>
                                  )}

                                  {/* ROUTING C: Contract Already Accepted -> High-Priority Proof-of-Reality Request Button */}
                                  {(isAccepted || isSoldAtFixedRate) && !isCancelRequested && (
                                    <button
                                      onClick={() => openProofOfRealityModal(crop)}
                                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                                    >
                                      <FileWarning className="w-4 h-4" />
                                      <span>Request Contract Cancellation</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* ROUTING B: Listing has Pending Offers -> Decline Bid with rapid popover */}
                            {!isAccepted && cropBids.length > 0 && (
                              <div className="p-5 bg-white space-y-3">
                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                                  Pending Counter-Offers ({cropBids.length})
                                </h4>

                                <div className="space-y-2.5">
                                  {cropBids.map((bid) => (
                                    <div
                                      key={bid.id}
                                      className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-emerald-300 transition-all"
                                    >
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-black text-emerald-900 text-base">
                                            ₹{bid.bidPrice.toLocaleString('en-IN')}/Qtl
                                          </span>
                                          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                                            Destination: {bid.buyerCity}
                                          </span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center space-x-2">
                                          <span>Pickup Target: {bid.pickupDate}</span>
                                          <span>•</span>
                                          <span className="text-slate-400">Buyer Verified 🔒</span>
                                        </div>
                                      </div>

                                      <div className="flex items-center space-x-2 w-full sm:w-auto relative">
                                        {/* Accept Bid Button */}
                                        <button
                                          onClick={() => setPendingAcceptBid(bid)}
                                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Accept Offer</span>
                                        </button>

                                        {/* Decline Bid Button with Rapid Reason Popover */}
                                        <button
                                          onClick={() => setDecliningBidId(decliningBidId === bid.id ? null : bid.id)}
                                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                                        >
                                          <XCircle className="w-3.5 h-3.5" />
                                          <span>Decline Bid</span>
                                        </button>

                                        {/* Rapid Reason Popover */}
                                        {decliningBidId === bid.id && (
                                          <div className="absolute right-0 top-12 z-20 bg-white border border-slate-300 rounded-2xl p-4 shadow-xl w-64 space-y-3 animate-in fade-in zoom-in-95">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold text-slate-900">Select Decline Reason:</span>
                                              <button
                                                onClick={() => setDecliningBidId(null)}
                                                className="text-slate-400 hover:text-slate-600 text-xs"
                                              >
                                                ✕
                                              </button>
                                            </div>

                                            <select
                                              value={declineReason}
                                              onChange={(e) => setDeclineReason(e.target.value)}
                                              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl"
                                            >
                                              <option value="Price below target">Price below target</option>
                                              <option value="Logistics delay">Logistics delay</option>
                                              <option value="Buyer rating low">Buyer rating low</option>
                                              <option value="Lot reserved for local Mandi">Lot reserved for local Mandi</option>
                                            </select>

                                            <button
                                              onClick={() => handleConfirmDeclineBid(crop.id, bid.id)}
                                              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                                            >
                                              Confirm Decline
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </>
            )}

            {/* ---------------------------------------------------- */}
            {/* ENGINE B: LIVE AUCTION ARENA VIEW (FARMER SIDE) */}
            {/* ---------------------------------------------------- */}
            {currentPortalView === 'AUCTION' && (
              <div className="space-y-6">
                
                {/* Auction Arena Header Banner */}
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 bg-amber-900/40 text-amber-200 border border-amber-400/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>Live Wholesale Competitive Bidding Engine</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">Live Auction Arena</h2>
                    <p className="text-xs text-amber-100 mt-1">
                      Sell agricultural harvests to the highest bidder before the window closes. Real-time timer ticker.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveAuctionTab(activeAuctionTab === 'CREATE_AUCTION' ? 'AUCTION_LIST' : 'CREATE_AUCTION')}
                    className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-50 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-600" />
                    <span>{activeAuctionTab === 'CREATE_AUCTION' ? 'View Ongoing Lots' : '+ Launch New Auction Slot'}</span>
                  </button>
                </div>

                {/* Sub-view: Auction Upload Portal Form */}
                {activeAuctionTab === 'CREATE_AUCTION' && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center">
                        <Flame className="w-5 h-5 mr-2 text-amber-600" />
                        Launch New Auction Slot
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Set a reserve base price and countdown window. Highest bid at expiry automatically locks the contract.
                      </p>
                    </div>

                    <form onSubmit={handleAuctionSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Crop Name
                          </label>
                          <input
                            type="text"
                            required
                            value={auctionForm.cropName}
                            onChange={(e) => setAuctionForm({ ...auctionForm, cropName: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g. Export Red Onion Lot"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Variety & Grade
                          </label>
                          <input
                            type="text"
                            required
                            value={auctionForm.variety}
                            onChange={(e) => setAuctionForm({ ...auctionForm, variety: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                            placeholder="e.g. Grade A Premium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Quantity (Quintals)
                          </label>
                          <input
                            type="number"
                            min={1}
                            required
                            value={auctionForm.quantity}
                            onChange={(e) => setAuctionForm({ ...auctionForm, quantity: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Reserve Base Price (₹/Qtl)
                          </label>
                          <input
                            type="number"
                            min={100}
                            required
                            value={auctionForm.reservePrice}
                            onChange={(e) => setAuctionForm({ ...auctionForm, reservePrice: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold text-amber-800 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Expiry Duration (Hours)
                          </label>
                          <select
                            value={auctionForm.durationHours}
                            onChange={(e) => setAuctionForm({ ...auctionForm, durationHours: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-amber-500"
                          >
                            <option value={1}>1 Hour (Flash Auction)</option>
                            <option value={2}>2 Hours (Standard)</option>
                            <option value={4}>4 Hours (Recommended)</option>
                            <option value={12}>12 Hours (Overnight)</option>
                            <option value={24}>24 Hours (Full Day)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                          Farm Pickup Address
                        </label>
                        <input
                          type="text"
                          required
                          value={auctionForm.pickupAddress}
                          onChange={(e) => setAuctionForm({ ...auctionForm, pickupAddress: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <Flame className="w-4 h-4 text-amber-300" />
                        <span>Publish Auction Slot & Start Bidding Clock 🔥</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Sub-view: Ongoing Slots with Visual Countdown Timers & Highest Bid at Top */}
                <div className="space-y-4">
                  {auctions.map((auc) => {
                    const sortedBids = [...(auc.bidsHistory || [])].sort((a, b) => b.amount - a.amount);

                    return (
                      <div
                        key={auc.id}
                        className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:border-amber-400 transition-all"
                      >
                        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={auc.image}
                              alt={auc.cropName}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-extrabold text-base text-white">{auc.cropName}</h3>
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                                  {auc.variety}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 mt-0.5">
                                Lot Quantity: <strong className="text-white">{auc.quantity} Qtl</strong> • District: {auc.farmerDistrict}
                              </p>
                            </div>
                          </div>

                          {/* Countdown Timer */}
                          <div className="flex flex-col sm:items-end space-y-1">
                            <AuctionCountdown expiresAt={auc.expiresAt} />
                            <span className="text-[10px] text-slate-400">Live Ticking Window</span>
                          </div>
                        </div>

                        {/* Auction Price Stats */}
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50 text-xs">
                          <div>
                            <span className="text-slate-400 block uppercase text-[10px] font-semibold">Reserve Base:</span>
                            <span className="font-bold text-slate-800 text-sm">₹{auc.reservePrice.toLocaleString('en-IN')}/Qtl</span>
                          </div>

                          <div>
                            <span className="text-emerald-700 block uppercase text-[10px] font-bold">Current Highest Bid:</span>
                            <span className="font-extrabold text-emerald-800 text-lg">₹{auc.currentHighestBid.toLocaleString('en-IN')}/Qtl</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block uppercase text-[10px] font-semibold">Leading Bidder:</span>
                            <span className="font-bold text-slate-900 text-xs truncate block">{auc.highestBidderName}</span>
                          </div>
                        </div>

                        {/* Incoming Bids Feed with Highest Bid at Absolute Top */}
                        <div className="p-5">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Incoming Bids Feed (Highest Offer at Top)</span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              {sortedBids.length} Offers Registered
                            </span>
                          </h4>

                          {sortedBids.length === 0 ? (
                            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl text-center">
                              No bids placed yet. Reserve price is currently active.
                            </p>
                          ) : (
                            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                              {sortedBids.map((offer, idx) => (
                                <div
                                  key={offer.id || idx}
                                  className={`p-3 flex items-center justify-between text-xs transition-colors ${
                                    idx === 0
                                      ? 'bg-emerald-50/80 font-bold text-emerald-950 border-l-4 border-l-emerald-600'
                                      : 'bg-white text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    {idx === 0 && (
                                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black">
                                        #1 LEADER
                                      </span>
                                    )}
                                    <span>{offer.bidderName}</span>
                                  </div>

                                  <div className="flex items-center space-x-4">
                                    <span className="font-black text-sm text-slate-900">
                                      ₹{offer.amount.toLocaleString('en-IN')}/Qtl
                                    </span>
                                    <span className="text-[10px] text-slate-400">{offer.timestamp || 'Just now'}</span>
                                  </div>
                                </div>
                              ))}
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

      {/* CONFIRMATION MODAL: ACCEPT BID */}
      {pendingAcceptBid && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border-2 border-emerald-500 animate-in zoom-in-95">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t.confirmAcceptBidTitle}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  MahaAgri Escrow System Protection
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {t.confirmAcceptBidMsg?.replace('{price}', pendingAcceptBid.bidPrice.toLocaleString('en-IN')) || 
                `Do you want to accept this bid of ₹${pendingAcceptBid.bidPrice}/Qtl from ${pendingAcceptBid.buyerName}?`}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setPendingAcceptBid(null)}
                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {t.confirmNo}
              </button>

              <button
                onClick={confirmAcceptBidAction}
                className="w-1/2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>{t.confirmYes}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
