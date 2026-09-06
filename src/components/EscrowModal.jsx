import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Lock, ShieldCheck, Phone, MapPin, Building2, Calendar, FileText, Printer, X, Sparkles, XCircle, Award, Landmark } from 'lucide-react';

export const EscrowModal = () => {
  const { activeModal, setActiveModal, cancelDeal, t, farmerProfile, buyerProfile } = useApp();

  if (!activeModal || activeModal.type !== 'FULFILLMENT_SLIP') return null;

  const { crop, bid, transactionId, govtCessTax, totalAmount, farmerAadhaar, buyerGstin } = activeModal.data;

  const totalValueNum = totalAmount || (bid.bidPrice * (crop?.quantity || 1));
  const cessTaxNum = govtCessTax || Math.round(totalValueNum * 0.01);
  const transIdStr = transactionId || `MH-ESCROW-2026-89412`;
  const farmerAadhaarStr = farmerAadhaar || farmerProfile.aadhaar || 'XXXX-XXXX-8821';
  const buyerGstinStr = buyerGstin || buyerProfile.gstinNumber || '27AAACM1234F1Z5';

  const handlePrint = () => {
    window.print();
  };

  const handleCancelDeal = () => {
    if (window.confirm(t.cancelConfirmMsg)) {
      cancelDeal(crop.id, bid.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border-2 border-emerald-500 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200 animate-bounce">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.bidAccepted}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t.escrowModalTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official B2B Agri Procurement Audit Slip • Government Compliance SIH26132
          </p>
        </div>

        {/* Digital Deal Slip Printable Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-inner mb-6 space-y-5 border border-emerald-500/40">
          
          {/* Header Row with Mock QR Code & Transaction ID */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
            
            <div className="space-y-1 text-center sm:text-left">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {t.digitalDealSlip}
              </span>
              <div className="pt-1">
                <span className="text-[11px] text-slate-400 block font-semibold">{t.transactionIdLabel}:</span>
                <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                  {transIdStr}
                </span>
              </div>
            </div>

            {/* Stylized Audit QR Code */}
            <div className="flex items-center space-x-3 bg-slate-900/90 p-2.5 rounded-xl border border-emerald-700/50">
              <div className="w-20 h-20 bg-white p-1.5 border-2 border-emerald-600 rounded-lg flex flex-col items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                  <rect x="0" y="0" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="8" width="14" height="14" fill="currentColor" />
                  <rect x="70" y="0" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="78" y="8" width="14" height="14" fill="currentColor" />
                  <rect x="0" y="70" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="8" y="78" width="14" height="14" fill="currentColor" />
                  <rect x="40" y="5" width="8" height="8" fill="currentColor" />
                  <rect x="52" y="15" width="8" height="8" fill="currentColor" />
                  <rect x="35" y="35" width="12" height="12" fill="#059669" />
                  <rect x="55" y="35" width="10" height="10" fill="currentColor" />
                  <rect x="5" y="40" width="8" height="8" fill="currentColor" />
                  <rect x="18" y="52" width="8" height="8" fill="currentColor" />
                  <rect x="40" y="50" width="20" height="20" rx="4" fill="#047857" />
                  <rect x="70" y="45" width="8" height="8" fill="currentColor" />
                  <rect x="85" y="55" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="80" width="8" height="8" fill="currentColor" />
                  <rect x="60" y="75" width="10" height="10" fill="currentColor" />
                  <rect x="78" y="85" width="8" height="8" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[10px] text-emerald-300 space-y-0.5">
                <span className="font-bold block text-white">{t.scanQrLabel}</span>
                <span className="block text-slate-400 font-mono text-[9px]">SIH26132-MH-GOV</span>
                <span className="inline-block bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                  VALIDATED ✅
                </span>
              </div>
            </div>

          </div>

          {/* Financial Breakdown Grid including 1% Govt Cess Tax */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Quantity</span>
              <span className="font-extrabold text-sm text-white">{crop?.quantity} Quintals</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Agreed Rate</span>
              <span className="font-extrabold text-sm text-white">₹{bid?.bidPrice}/Qtl</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-300 block uppercase font-bold">{t.govtCessTaxLabel}</span>
              <span className="font-extrabold text-sm text-amber-300">₹{cessTaxNum.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-800/40">
              <span className="text-[10px] text-emerald-300 block uppercase font-bold">Total Escrow Funds</span>
              <span className="font-black text-base text-emerald-400">₹{totalValueNum.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Masked Govt Identities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{t.farmerAadhaarLabel}</span>
                <span className="font-mono font-bold text-white text-xs">{farmerAadhaarStr}</span>
              </div>
              <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700">
                VERIFIED
              </span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-800/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">{t.buyerGstinLabel}</span>
                <span className="font-mono font-bold text-amber-300 text-xs">{buyerGstinStr}</span>
              </div>
              <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700">
                GSTIN AUTH
              </span>
            </div>
          </div>

        </div>

        {/* Detailed Addresses Section */}
        <div className="space-y-4 text-xs mb-6">
          <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center">
            <FileText className="w-4 h-4 mr-1.5 text-emerald-600" />
            Individual Pickup & Delivery Warehouse Addresses
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Farmer Pickup Location */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {t.pickupAddressLabel}
              </span>
              <p className="font-bold text-slate-900 text-sm">{crop?.farmerName}</p>
              <p className="text-slate-600 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                {crop?.farmerPhone}
              </p>
              <p className="text-slate-600 flex items-start">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                <span>{crop?.farmerLocation}</span>
              </p>
            </div>

            {/* Buyer Delivery Warehouse */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 space-y-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {t.deliveryAddressLabel}
              </span>
              <p className="font-bold text-slate-900 text-sm">{bid?.buyerName}</p>
              <p className="text-slate-800 font-bold flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                {bid?.buyerPhone} ({bid?.buyerContactName})
              </p>
              <p className="text-slate-600 flex items-start">
                <Building2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0 mt-0.5" />
                <span>{bid?.buyerAddress}</span>
              </p>
            </div>

          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-900">
            <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Scheduled Pickup Logistics Date: <strong className="font-bold">{bid?.pickupDate}</strong></span>
          </div>
        </div>

        {/* Action Buttons: Print, Cancel Deal, Close */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 border-t border-slate-100">
          
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printSlipBtn}</span>
          </button>

          <button
            onClick={handleCancelDeal}
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>{t.cancelDealBtn}</span>
          </button>

          <button
            onClick={() => setActiveModal(null)}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
          >
            {t.closeBtn}
          </button>

        </div>

      </div>
    </div>
  );
};
