import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShoppingBag, ShieldCheck, ArrowRight, Phone, CheckCircle2, Lock, Sparkles, Building2, TrendingUp } from 'lucide-react';

export const AuthPage = () => {
  const { login, t } = useApp();
  const [selectedRole, setSelectedRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [phone, setPhone] = useState('9822014321');
  const [name, setName] = useState('Ramesh Patil');
  const [otpStep, setOtpStep] = useState('INPUT'); // 'INPUT' | 'OTP_SENT' | 'VERIFYING' | 'SUCCESS'
  const [otpCode, setOtpCode] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'farmer') {
      setPhone('9822014321');
      setName('Ramesh Patil (Satana, Nashik)');
    } else {
      setPhone('9422188990');
      setName('Mahavira Spices & Foods Pvt Ltd');
    }
    setOtpStep('INPUT');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setOtpStep('OTP_SENT');
  };

  const handleVerifyOtp = (codeToVerify) => {
    setOtpStep('VERIFYING');
    setTimeout(() => {
      setOtpStep('SUCCESS');
      setTimeout(() => {
        login(selectedRole, phone, name);
      }, 600);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white/95 rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30">
        
        {/* Left Side: Agricultural Hero & Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />

          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-700/40 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIH Problem Statement SIH26132</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-4">
              Strengthening Market Linkages for Farmers
            </h1>

            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6">
              Direct APMC market linkages, transparent buyer bidding, logistics tracking, and real-time Maharashtra mandi price discovery.
            </p>

            <div className="space-y-3 my-4">
              <div className="flex items-start space-x-3 text-xs text-emerald-100/90">
                <div className="p-1.5 bg-emerald-700/50 rounded-lg text-emerald-300 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Live Price Discovery</strong>
                  <span>APMC mandi ticker for Onion, Soyabean, Cotton & Rice across Maharashtra.</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs text-emerald-100/90">
                <div className="p-1.5 bg-emerald-700/50 rounded-lg text-emerald-300 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-semibold">Privacy & Escrow Protection</strong>
                  <span>Buyer contact details stay hidden until farmer accepts the bid.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-700/40 flex items-center justify-between text-xs text-emerald-200/70">
            <span>Built for Rural Usability</span>
            <span className="font-semibold text-amber-300">Smart India Hackathon</span>
          </div>
        </div>

        {/* Right Side: Role Selection & OTP Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-50">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t.signInTitle}</h2>
            <p className="text-slate-500 text-xs mt-1">{t.signInSubtitle}</p>
          </div>

          {/* Role Switcher Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('farmer')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedRole === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 rounded-xl ${selectedRole === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Sprout className="w-5 h-5" />
                </div>
                {selectedRole === 'farmer' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{t.farmer}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">List Crops & Accept Bids</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('buyer')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                selectedRole === 'buyer'
                  ? 'border-amber-600 bg-amber-50/70 shadow-md shadow-amber-100'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 rounded-xl ${selectedRole === 'buyer' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                {selectedRole === 'buyer' && (
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-900 text-sm block">{t.buyer}</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Place Counter-Bids & Procure</span>
              </div>
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {selectedRole === 'farmer' ? 'Farmer Name / Farm Title' : 'Corporate Company / Buyer Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                placeholder={selectedRole === 'farmer' ? 'e.g. Ramesh Patil' : 'e.g. Mahavira Spices Ltd'}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {t.mobileNumber}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-sm font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            {/* OTP Workflow Container */}
            {otpStep === 'INPUT' && (
              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-white font-semibold text-sm shadow-lg flex items-center justify-center space-x-2 transition-all ${
                  selectedRole === 'farmer'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{t.sendOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {otpStep === 'OTP_SENT' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.otpSentMsg}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg text-center font-mono tracking-widest text-slate-900 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyOtp(otpCode || '123456')}
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow transition-all"
                  >
                    {t.autoVerifyBtn}
                  </button>
                </div>
              </div>
            )}

            {otpStep === 'VERIFYING' && (
              <div className="p-4 bg-slate-100 rounded-2xl flex items-center justify-center space-x-3 text-slate-700 text-xs font-semibold">
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>{t.verifying}</span>
              </div>
            )}

            {otpStep === 'SUCCESS' && (
              <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-center space-x-2 text-xs font-bold shadow-lg animate-bounce">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.verifiedSuccess}</span>
              </div>
            )}

          </form>

          {/* Quick Demo Presets */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Prototype Demo Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => login('farmer', '9822014321', 'Ramesh Patil (Nashik Farmer)')}
                className="py-1.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs rounded-lg font-medium transition-colors text-center"
              >
                🌾 Demo Farmer View
              </button>
              <button
                type="button"
                onClick={() => login('buyer', '9422188990', 'Mahavira Spices Ltd')}
                className="py-1.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs rounded-lg font-medium transition-colors text-center"
              >
                🛒 Demo Buyer View
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
