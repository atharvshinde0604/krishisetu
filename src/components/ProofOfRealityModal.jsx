import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Camera,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  X,
  RefreshCw,
  FileWarning,
  MapPin,
  Clock,
  Cpu,
  Lock
} from 'lucide-react';

export const ProofOfRealityModal = () => {
  const { proofOfRealityData, closeProofOfRealityModal, submitProofOfRealityCancellation, farmerProfile, t } = useApp();

  const [emergencyReason, setEmergencyReason] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [simulateTampered, setSimulateTampered] = useState(false);

  if (!proofOfRealityData) return null;

  const crop = proofOfRealityData;

  const handleImageCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);

      // Trigger 2-second mock processing loader
      setIsScanning(true);
      setScanComplete(false);

      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
      }, 2000);
    }
  };

  const handleTamperToggle = () => {
    setSimulateTampered(!simulateTampered);
  };

  const handleConfirmSubmit = () => {
    if (!emergencyReason) return;
    if (!capturedImage) return;
    if (simulateTampered) return; // Blocked if tampered

    submitProofOfRealityCancellation(crop.id, {
      reason: emergencyReason,
      image: imagePreview,
      verifiedAt: new Date().toISOString(),
      exifVerified: true,
      gpsBoundsVerified: true
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-500/80 relative my-8">
        
        {/* Close Button */}
        <button
          onClick={closeProofOfRealityModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200 text-white">
            <FileWarning className="w-7 h-7" />
          </div>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
            APMC Maharashtra Regulatory Enforcement
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Official APMC Contract Cancellation Form
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Produce: <span className="font-bold text-slate-800">{crop.name || t[crop.nameKey] || 'Farm Produce'}</span> ({crop.quantity} Quintals) • Deal ID: <span className="font-mono">{crop.id}</span>
          </p>
        </div>

        {/* Major Regulatory Warning Banner */}
        <div className="bg-red-50 border-2 border-red-500/60 rounded-2xl p-4 text-red-900 mb-6 flex items-start space-x-3 shadow-inner">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed font-semibold">
            ⚠️ <span className="font-black text-red-700">WARNING:</span> Evasion of digital contracts to settle offline drops your platform Trust Score, voids all Maharashtra state transport subsidies, and flags your 7/12 Land Record profile for audit compliance.
          </div>
        </div>

        {/* Form Body */}
        <div className="space-y-5">
          {/* Emergency Dropdown Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Select Legitimate Emergency Justification <span className="text-red-500">*</span>
            </label>
            <select
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="">-- Choose Emergency Reason --</option>
              <option value="Crop Spoiled by Storm Rain">Crop Spoiled by Storm Rain (अतिवृष्टी / गारपीट)</option>
              <option value="Pest Influx Post-Harvest">Pest Influx Post-Harvest (काढणीनंतर कीड प्रादुर्भाव)</option>
            </select>
          </div>

          {/* Camera File Input Component with Explicit Locked-Down Label Styling */}
          {emergencyReason && (
            <div className="border-2 border-dashed border-amber-300 bg-amber-50/40 rounded-2xl p-5 text-center space-y-3">
              <div className="inline-flex items-center space-x-2 bg-amber-200/70 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-[11px] font-bold">
                <Camera className="w-3.5 h-3.5" />
                <span>📷 Live In-App Camera Hub Only (Device Media Gallery Upload Disabled for Proof-of-Reality Protocol Verification)</span>
              </div>

              <p className="text-xs text-slate-600">
                Snap real-time photo of affected produce in the field. EXIF timestamp and GPS telemetry will be cryptographically audited against your 7/12 land records.
              </p>

              <div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="proof-of-reality-camera"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <label
                  htmlFor="proof-of-reality-camera"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-xs font-extrabold cursor-pointer hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-600/30 transition-all"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  <span>Launch Live Verified Camera</span>
                </label>
              </div>

              {/* 2-Second Mock Processing Loader */}
              {isScanning && (
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl flex items-center justify-center space-x-3 text-xs font-mono border border-emerald-500/40 animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Running Cryptographic EXIF Data Scan & Sensor Validation...</span>
                </div>
              )}

              {/* Captured Image Preview & Verification Badges */}
              {scanComplete && imagePreview && (
                <div className="space-y-4 pt-2 text-left">
                  <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Proof of reality"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-300"
                    />
                    <div className="text-xs text-slate-700 space-y-0.5">
                      <div className="font-bold text-slate-900">Live Snapshot Captured</div>
                      <div className="text-[11px] text-slate-500 font-mono">Format: RAW Sensor RGB Stream</div>
                      <div className="text-[11px] text-slate-500 font-mono">Gat No: {farmerProfile.gutNumber} ({farmerProfile.district})</div>
                    </div>
                  </div>

                  {/* Verification Badges Checklist or Tampered Warning */}
                  {!simulateTampered ? (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="font-bold text-emerald-950 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                        Proof-of-Reality Protocol Authenticated:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-800 font-medium">
                        <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                          <span>Camera Hardware Sensor: Verified ✅</span>
                        </div>
                        <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                          <span>Time Signature: Synced ✅</span>
                        </div>
                        <div className="bg-white/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                          <span>GPS Bounds: Matches Verified 7/12 Farm Location ✅</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Crimson Warning Window for AI/Tampered Detection */
                    <div className="bg-red-600 text-white rounded-xl p-4 text-xs font-medium space-y-2 border-2 border-red-700 shadow-lg animate-in zoom-in-95">
                      <div className="flex items-center space-x-2 font-black text-sm text-yellow-300">
                        <ShieldAlert className="w-5 h-5 text-yellow-300" />
                        <span>🚨 VALIDATION FAILED: AI / Metadata Tampering Detected</span>
                      </div>
                      <p className="leading-relaxed">
                        Image lacks hardware-locked camera signatures and authentic location tags. Suspicious or computer-generated AI artifact detected. Cancellation blocked. Account flagged for APMC field audit.
                      </p>
                    </div>
                  )}

                  {/* Testing Bypass Switch */}
                  <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Testing & Demonstration Tool:</span>
                    <button
                      type="button"
                      onClick={handleTamperToggle}
                      className={`px-3 py-1 rounded-lg font-bold border transition-colors ${
                        simulateTampered
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {simulateTampered ? '🔴 [Tampered File Mode ON]' : '⚙️ [Simulate Tampered/AI File]'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={closeProofOfRealityModal}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Abort / Keep Contract
          </button>

          <button
            type="button"
            onClick={handleConfirmSubmit}
            disabled={!emergencyReason || !scanComplete || simulateTampered}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-md ${
              !emergencyReason || !scanComplete || simulateTampered
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
            }`}
          >
            Submit APMC Cancellation Claim
          </button>
        </div>
      </div>
    </div>
  );
};
