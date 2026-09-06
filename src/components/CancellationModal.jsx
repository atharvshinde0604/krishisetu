import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle, ShieldAlert, XCircle, Upload, CheckCircle2, Clock,
  ShieldOff, Zap, MapPin, Truck, Satellite, Radio, AlertCircle,
  X, ChevronRight, FileWarning, Scale, Eye, Lock
} from 'lucide-react';

export const CancellationModal = () => {
  const {
    cancellationState, setCancellationState,
    submitCancellationRequest, respondToCancellation,
    t
  } = useApp();

  const [reason, setReason] = useState('');
  const [justification, setJustification] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);

  // Fraud engine animation states
  const [fraudStep, setFraudStep] = useState(0); // 0=idle, 1=gps, 2=telematics, 3=ledger, 4=result
  const [collusionDetected, setCollusionDetected] = useState(false);

  if (!cancellationState) return null;

  const { phase, cropId, bidId, initiator, reason: cancelReason, crop, bid } = cancellationState;

  const needsEvidence = reason === 'WEATHER' || reason === 'QUALITY';

  const cancellationReasons = [
    { value: '', label: t.cancelReasonSelect || 'Select a reason for cancellation...' },
    { value: 'WEATHER', label: t.cancelReasonWeather || 'Crop Ruined by Weather' },
    { value: 'LOGISTICS', label: t.cancelReasonLogistics || 'Logistics Vehicle Breakdown' },
    { value: 'ACCIDENTAL', label: t.cancelReasonAccidental || 'Accidental Booking' },
    { value: 'QUALITY', label: t.cancelReasonQuality || 'Quality Dispute' }
  ];

  const handleEvidenceUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setEvidencePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCancellation = () => {
    if (!reason) return;
    if (needsEvidence && !evidenceFile) return;
    if (!justification.trim()) return;

    submitCancellationRequest(cropId, bidId, reason, justification);
    setReason('');
    setJustification('');
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  const handleAcceptRelease = () => {
    // Start the fraud engine simulation
    setFraudStep(1);

    setTimeout(() => setFraudStep(2), 1000);
    setTimeout(() => setFraudStep(3), 2000);
    setTimeout(() => {
      setFraudStep(4);
      // Simulate collusion detection if reason was WEATHER
      if (cancelReason === 'WEATHER') {
        setCollusionDetected(true);
      } else {
        setCollusionDetected(false);
      }
    }, 3000);
  };

  const handleDisputeClaim = () => {
    respondToCancellation(cropId, bidId, 'DISPUTE');
  };

  const handleCloseAfterFraud = () => {
    if (collusionDetected) {
      respondToCancellation(cropId, bidId, 'COLLUSION');
    } else {
      respondToCancellation(cropId, bidId, 'ACCEPT');
    }
    setFraudStep(0);
    setCollusionDetected(false);
  };

  const handleCloseModal = () => {
    setCancellationState(null);
    setFraudStep(0);
    setCollusionDetected(false);
    setReason('');
    setJustification('');
    setEvidenceFile(null);
    setEvidencePreview(null);
  };

  const reasonLabel = cancellationReasons.find(r => r.value === cancelReason)?.label || cancelReason;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        {phase !== 'FRAUD_CHECK' && (
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ============================================== */}
        {/* PHASE 1: INITIAL CANCELLATION REQUEST FORM */}
        {/* ============================================== */}
        {phase === 'REQUEST' && (
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.cancelModalTitle || '⚠️ Security Notice: Cancellation Request'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {t.cancelModalSubtitle || 'MahaAgri Escrow Transaction Governance'}
                </p>
              </div>
            </div>

            {/* WARNING BANNER */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-800 leading-relaxed">
                    {t.cancelWarning || 'Processing deals offline removes your Government Escrow Payment Protection, voids state transport subsidies, and lowers your Platform Trust Score.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Crop / Deal info card */}
            {crop && bid && (
              <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{t[crop.nameKey] || crop.name}</span>
                    <span className="text-slate-500 ml-2">{crop.quantity} Qtl</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">₹{bid.bidPrice?.toLocaleString('en-IN')}/Qtl</span>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                  <span>{t[crop.farmerLocationKey] || crop.farmerLocation}</span>
                  <span className="font-semibold text-amber-700">
                    {t.cancelTotalValue || 'Total'}: ₹{((bid.bidPrice || 0) * (crop.quantity || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* Reason Dropdown */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.cancelReasonLabel || 'Reason for Cancellation'}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              >
                {cancellationReasons.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Evidence Upload (for Weather / Quality) */}
            {needsEvidence && (
              <div className="mb-4 animate-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-1.5 flex items-center">
                  <Upload className="w-3.5 h-3.5 mr-1" />
                  {t.cancelEvidenceLabel || 'Upload Photo Evidence for APMC Compliance (Required)'}
                </label>
                <div className="relative border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-xl p-4 text-center cursor-pointer transition-all bg-rose-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEvidenceUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {evidencePreview ? (
                    <div className="flex items-center space-x-3">
                      <img src={evidencePreview} alt="Evidence" className="w-16 h-16 rounded-lg object-cover border border-rose-200" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-800">{evidenceFile?.name}</p>
                        <p className="text-[10px] text-emerald-700 font-semibold">✓ {t.cancelEvidenceUploaded || 'Evidence file attached'}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                      <p className="text-xs text-rose-600 font-semibold">{t.cancelEvidenceUploadPrompt || 'Click or drop photo evidence here'}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Justification TextArea */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t.cancelJustificationLabel || 'Detailed Justification (Required)'}
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder={t.cancelJustificationPlaceholder || 'Provide specific details for why this deal needs to be cancelled...'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseModal}
                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {t.cancelGoBack || 'Go Back'}
              </button>
              <button
                onClick={handleSubmitCancellation}
                disabled={!reason || !justification.trim() || (needsEvidence && !evidenceFile)}
                className={`w-2/3 py-3 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                  reason && justification.trim() && (!needsEvidence || evidenceFile)
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{t.cancelSubmitBtn || 'Submit Cancellation Request'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* PHASE 2A: INITIATOR SIDE - Pending Approval */}
        {/* ============================================== */}
        {phase === 'PENDING_INITIATOR' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                <Clock className="w-7 h-7 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.cancelPendingTitle || 'Cancellation Pending Approval'}
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  {t.cancelPendingSubtitle || 'Waiting for counter-party agreement'}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-100 text-amber-900 border-2 border-amber-400 rounded-full text-sm font-extrabold shadow-sm animate-pulse">
                <Clock className="w-4 h-4" />
                <span>{t.cancelPendingBadge || 'Cancellation Pending Approval'}</span>
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-xs text-amber-800 leading-relaxed">
              <p className="font-semibold mb-2">{t.cancelPendingNote || 'Your cancellation request has been submitted. The counter-party must agree to release the escrow funds.'}</p>
              <p className="font-medium text-amber-700">
                {t.cancelPendingReason || 'Reason'}: <strong>{reasonLabel}</strong>
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.cancelEscrowStatus || 'Escrow Status'}:</span>
                <span className="font-bold text-amber-700 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  {t.cancelEscrowLocked || 'Funds Locked (Pending Decision)'}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              {t.closeBtn || 'Close'}
            </button>
          </div>
        )}

        {/* ============================================== */}
        {/* PHASE 2B: COUNTER-PARTY SIDE - Urgent Alert */}
        {/* ============================================== */}
        {phase === 'PENDING_COUNTERPARTY' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl animate-bounce" style={{ animationDuration: '2s' }}>
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.cancelAlertTitle || '🚨 Cancellation Request Received'}
                </h3>
                <p className="text-xs text-rose-700 font-semibold">
                  {t.cancelAlertSubtitle || 'Urgent: Action Required'}
                </p>
              </div>
            </div>

            {/* Urgent Alert Card */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-2 border-rose-300 rounded-2xl p-5 mb-5">
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {t.cancelAlertMessage || 'The other party has requested to cancel this deal due to:'}{' '}
                <strong className="text-rose-800 bg-rose-100 px-2 py-0.5 rounded-lg">{reasonLabel}</strong>
              </p>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {t.cancelAlertQuestion || 'Do you agree to release them from this contract?'}
              </p>
            </div>

            {/* Deal Summary */}
            {crop && bid && (
              <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{t[crop.nameKey] || crop.name}</span>
                  <span className="font-extrabold text-emerald-700">₹{bid.bidPrice?.toLocaleString('en-IN')}/Qtl × {crop.quantity} Qtl</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-slate-500">
                  <span>{t[crop.farmerLocationKey] || crop.farmerLocation}</span>
                  <span className="font-bold text-amber-700">
                    = ₹{((bid.bidPrice || 0) * (crop.quantity || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}

            {/* Two Choices */}
            <div className="space-y-3">
              {/* Choice A: Accept & Release */}
              <button
                onClick={handleAcceptRelease}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.cancelAcceptRelease || 'Accept & Release Funds'}</span>
              </button>

              {/* Choice B: Dispute Claim */}
              <button
                onClick={handleDisputeClaim}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Scale className="w-5 h-5" />
                <span>{t.cancelDisputeClaim || 'Dispute Claim'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================== */}
        {/* PHASE 3: FRAUD ENGINE SIMULATION */}
        {/* ============================================== */}
        {phase === 'FRAUD_CHECK' && (
          <div className="p-6 sm:p-8">

            {/* If fraud steps are running (1-3) */}
            {fraudStep >= 1 && fraudStep <= 3 && (
              <>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <Satellite className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {t.fraudEngineTitle || 'MahaAgri Fraud Engine'}
                    </h3>
                    <p className="text-xs text-indigo-700 font-semibold">
                      {t.fraudEngineSubtitle || 'Running background data audits...'}
                    </p>
                  </div>
                </div>

                {/* Animated Loading Steps */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-5 text-white space-y-4">
                  
                  {/* Step 1: GPS */}
                  <div className={`flex items-center space-x-3 transition-all duration-500 ${fraudStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`p-2 rounded-xl ${fraudStep > 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {fraudStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5 animate-pulse" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">
                        {t.fraudStepGps || 'Vehicle GPS Geo-Fencing Audit'}
                      </p>
                      <div className={`h-1.5 rounded-full mt-1 overflow-hidden ${fraudStep > 1 ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`h-full rounded-full transition-all duration-1000 ${fraudStep > 1 ? 'w-full bg-emerald-400' : 'w-2/3 bg-indigo-500 animate-pulse'}`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {fraudStep > 1 ? '✓ DONE' : 'SCANNING...'}
                    </span>
                  </div>

                  {/* Step 2: Telematics */}
                  <div className={`flex items-center space-x-3 transition-all duration-500 ${fraudStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`p-2 rounded-xl ${fraudStep > 2 ? 'bg-emerald-500/20 text-emerald-400' : fraudStep === 2 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                      {fraudStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : <Truck className={`w-5 h-5 ${fraudStep === 2 ? 'animate-pulse' : ''}`} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">
                        {t.fraudStepTelematics || 'Transport Telematics Cross-Check'}
                      </p>
                      <div className={`h-1.5 rounded-full mt-1 overflow-hidden ${fraudStep > 2 ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        <div className={`h-full rounded-full transition-all duration-1000 ${fraudStep > 2 ? 'w-full bg-emerald-400' : fraudStep === 2 ? 'w-1/2 bg-indigo-500 animate-pulse' : 'w-0'}`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {fraudStep > 2 ? '✓ DONE' : fraudStep === 2 ? 'SCANNING...' : 'QUEUED'}
                    </span>
                  </div>

                  {/* Step 3: Land Ledger Sync */}
                  <div className={`flex items-center space-x-3 transition-all duration-500 ${fraudStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`p-2 rounded-xl ${fraudStep === 3 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                      <Radio className={`w-5 h-5 ${fraudStep === 3 ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold">
                        {t.fraudStepLedger || 'Land Ledger & Record Sync'}
                      </p>
                      <div className={`h-1.5 rounded-full mt-1 overflow-hidden bg-slate-700`}>
                        <div className={`h-full rounded-full transition-all duration-1000 ${fraudStep === 3 ? 'w-1/3 bg-indigo-500 animate-pulse' : 'w-0'}`} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {fraudStep === 3 ? 'SCANNING...' : 'QUEUED'}
                    </span>
                  </div>

                </div>

                <p className="text-center text-xs text-slate-500 mt-4 font-medium animate-pulse">
                  {t.fraudEngineProcessing || 'MahaAgri Fraud Engine: Running background data audits (Vehicle GPS Geo-Fencing, Transport Telematics, Land Ledger Sync)...'}
                </p>
              </>
            )}

            {/* If fraud check complete (step 4) */}
            {fraudStep === 4 && !collusionDetected && (
              <>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      {t.cancelSuccessTitle || 'Deal Cancelled Mutually'}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {t.cancelSuccessSubtitle || 'No anomalies detected'}
                    </p>
                  </div>
                </div>

                {/* Success Badge */}
                <div className="flex justify-center mb-5">
                  <span className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-200 text-slate-700 border-2 border-slate-300 rounded-full text-sm font-extrabold">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" />
                    <span>{t.cancelMutualBadge || 'Cancelled — Mutual Agreement'}</span>
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 text-xs text-emerald-800 leading-relaxed">
                  <p className="font-bold text-sm mb-1">✅ {t.cancelMutualSuccess || 'Deal cancelled mutually. Escrow funds refunded. No penalties applied.'}</p>
                  <p className="text-emerald-700">{t.cancelMutualDetails || 'Both parties agreed to cancel. Escrow funds have been released back to the buyer. Crop listing is now re-opened for new bids.'}</p>
                </div>

                <button
                  onClick={handleCloseAfterFraud}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  {t.cancelDone || 'Done — Return to Dashboard'}
                </button>
              </>
            )}

            {/* ============================================== */}
            {/* PHASE 3B: COLLUSION DETECTED!! */}
            {/* ============================================== */}
            {fraudStep === 4 && collusionDetected && (
              <>
                <div className="flex items-center space-x-3 mb-5">
                  <div className="p-3 bg-red-100 text-red-700 rounded-2xl animate-bounce" style={{ animationDuration: '0.7s' }}>
                    <ShieldOff className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-red-800 text-lg">
                      {t.collusionTitle || '🚨 CRITICAL: System Collusion Detected'}
                    </h3>
                    <p className="text-xs text-red-700 font-semibold">
                      {t.collusionSubtitle || 'Administrative Override Activated'}
                    </p>
                  </div>
                </div>

                {/* Flashing Collusion Badge */}
                <div className="flex justify-center mb-5">
                  <span
                    className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-extrabold rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                      color: 'white',
                      animation: 'collusionFlash 0.5s ease-in-out infinite alternate'
                    }}
                  >
                    <ShieldOff className="w-5 h-5" />
                    <span>{t.collusionBadge || '🚨 CRITICAL: System Collusion Detected'}</span>
                  </span>
                </div>

                {/* Admin Freeze Box */}
                <div className="bg-gradient-to-b from-red-950 to-red-900 border-2 border-red-500 rounded-2xl p-5 mb-5 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-amber-300 text-sm uppercase tracking-wider">
                      {t.collusionFreezeTitle || 'Security Anomaly Detected'}
                    </h4>
                  </div>

                  <p className="text-xs text-red-100 leading-relaxed font-medium">
                    {t.collusionFreezeMsg || 'Background vehicle GPS coordinates confirm a physical cargo pickup was attempted at the farm location after submitting a cancellation request. Escrow funds are placed on a 24-hour administrative lock. Both user profiles have been flagged for a manual APMC field audit.'}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-red-200 font-semibold">{t.collusionEscrowLock || 'Escrow: 24-hour Administrative Lock'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-red-200 font-semibold">{t.collusionProfileFlag || 'Both profiles flagged for APMC field audit'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <Satellite className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-red-200 font-semibold">{t.collusionGpsEvidence || 'GPS Evidence: Vehicle detected at farm coordinates'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseAfterFraud}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  {t.collusionAcknowledge || 'Acknowledge — Funds Under Administrative Lock'}
                </button>
              </>
            )}
          </div>
        )}

        {/* ============================================== */}
        {/* PHASE 4: DISPUTED STATE */}
        {/* ============================================== */}
        {phase === 'DISPUTED' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-red-100 text-red-700 rounded-2xl">
                <Scale className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {t.disputeTitle || 'Disputed — Sent to APMC Arbitrator'}
                </h3>
                <p className="text-xs text-red-700 font-semibold">
                  {t.disputeSubtitle || 'Case under review by local APMC officer'}
                </p>
              </div>
            </div>

            {/* Disputed Badge */}
            <div className="flex justify-center mb-5">
              <span className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-100 text-red-800 border-2 border-red-400 rounded-full text-sm font-extrabold">
                <Scale className="w-4 h-4" />
                <span>{t.disputeBadge || 'Disputed — Sent to APMC Arbitrator'}</span>
              </span>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 text-xs text-red-800 leading-relaxed">
              <p className="font-bold text-sm mb-1">⚖️ {t.disputeMessage || 'A local APMC officer has been assigned to review your uploaded evidence. Funds are locked in escrow.'}</p>
              <p className="text-red-700 mt-2">{t.disputeDetails || 'The dispute will be reviewed within 3-5 working days. Both parties will be notified of the arbitration outcome.'}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.disputeReasonLabel || 'Cancellation Reason'}:</span>
                <span className="font-bold text-red-700">{reasonLabel}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t.cancelEscrowStatus || 'Escrow Status'}:</span>
                <span className="font-bold text-red-700 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  {t.disputeEscrowLocked || 'Funds Locked — Under Arbitration'}
                </span>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-xl transition-all"
            >
              {t.closeBtn || 'Close'}
            </button>
          </div>
        )}

        {/* ============================================== */}
        {/* PHASE 5: COLLUSION STATE (Administrative Lock) */}
        {/* ============================================== */}
        {phase === 'COLLUSION' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 bg-red-100 text-red-700 rounded-2xl animate-pulse">
                <ShieldOff className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-red-800 text-lg">
                  {t.collusionTitle || '🚨 CRITICAL: System Collusion Detected'}
                </h3>
                <p className="text-xs text-red-700 font-semibold">
                  {t.collusionSubtitle || 'Administrative Override Activated'}
                </p>
              </div>
            </div>

            <div className="flex justify-center mb-5">
              <span
                className="inline-flex items-center space-x-2 px-5 py-2.5 text-sm font-extrabold rounded-full shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  color: 'white',
                  animation: 'collusionFlash 0.5s ease-in-out infinite alternate'
                }}
              >
                <ShieldOff className="w-5 h-5" />
                <span>{t.collusionBadge || '🚨 CRITICAL: System Collusion Detected'}</span>
              </span>
            </div>

            <div className="bg-gradient-to-b from-red-950 to-red-900 border-2 border-red-500 rounded-2xl p-5 mb-5 text-white">
              <p className="text-xs text-red-100 leading-relaxed font-medium">
                {t.collusionFreezeMsg || 'Background vehicle GPS coordinates confirm a physical cargo pickup was attempted at the farm location after submitting a cancellation request. Escrow funds are placed on a 24-hour administrative lock. Both user profiles have been flagged for a manual APMC field audit.'}
              </p>
            </div>

            <button
              onClick={handleCloseModal}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              {t.closeBtn || 'Close'}
            </button>
          </div>
        )}
      </div>

      {/* Inline CSS for collusion flash animation */}
      <style>{`
        @keyframes collusionFlash {
          0% { opacity: 1; box-shadow: 0 0 15px rgba(220, 38, 38, 0.6); }
          100% { opacity: 0.7; box-shadow: 0 0 30px rgba(220, 38, 38, 1), 0 0 60px rgba(220, 38, 38, 0.4); }
        }
      `}</style>
    </div>
  );
};
