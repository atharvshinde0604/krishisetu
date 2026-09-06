import React, { createContext, useContext, useState } from 'react';
import { initialCrops, initialBids, mandiData, translations, initialAuctions, ogdMandiApiPayload } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState({
    role: 'farmer',
    phone: '9822014321',
    name: 'Ramesh Patil (Farmer)'
  });

  // Language state: 'EN' | 'HI' | 'MR'
  const [language, setLanguage] = useState('EN');
  const t = translations[language] || translations.EN;

  // Dual-Engine Portal View: 'REGULAR' | 'AUCTION'
  const [currentPortalView, setCurrentPortalView] = useState('REGULAR');

  // Farmer Profile & MahaBhulekh Land Verification State
  const [farmerProfile, setFarmerProfile] = useState({
    fullName: 'Ramesh Maruti Patil',
    phone: '9822014321',
    bankAccount: '918237465012',
    ifscCode: 'SBIN0001234',
    district: 'Nashik',
    taluka: 'Satana (Baglan)',
    village: 'Satana',
    gutNumber: '74/2A',
    aadhaar: 'XXXX-XXXX-8821',
    isLandVerified: false,
    landDetails: null
  });

  // Buyer Corporate Procurement Profile State
  const [buyerProfile, setBuyerProfile] = useState({
    companyName: 'Mahavira Spices & Foods Pvt Ltd',
    repName: 'Vikram Shah',
    email: 'procurement@mahaviraspices.com',
    panNumber: 'ABCDE1234F',
    gstinNumber: '27AAACM1234F1Z5',
    apmcLicense: 'APMC-MH-NSK-99214',
    isCorporateVerified: false
  });

  // Crops & Bids state
  const [crops, setCrops] = useState(initialCrops);
  const [bids, setBids] = useState(initialBids);
  const [auctions, setAuctions] = useState(initialAuctions);
  const [mandiPrices, setMandiPrices] = useState(mandiData);
  const [proofOfRealityData, setProofOfRealityData] = useState(null); // Proof-of-reality modal state

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'info',
      message: 'Welcome to KrishiSetu - SIH26132 Government Market Linkage Portal',
      timestamp: 'Just now'
    }
  ]);

  // Modal State
  const [activeModal, setActiveModal] = useState(null);

  // ============================================
  // CANCELLATION GOVERNANCE STATE
  // ============================================
  // cancellationState tracks the current cancellation flow
  // Possible phases: 'REQUEST' | 'PENDING_INITIATOR' | 'PENDING_COUNTERPARTY' | 'FRAUD_CHECK' | 'DISPUTED' | 'COLLUSION' | null
  const [cancellationState, setCancellationState] = useState(null);

  // Track cancellation requests per deal (cropId -> { reason, initiator, status })
  const [cancellationRequests, setCancellationRequests] = useState({});

  const addNotification = (type, message) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const login = (role, phone, name) => {
    setCurrentUser({
      role,
      phone: phone || (role === 'farmer' ? '9822014321' : '9422188990'),
      name: name || (role === 'farmer' ? 'Ramesh Patil' : 'Mahavira Foods Corp')
    });
    addNotification('success', `Signed in successfully as ${role === 'farmer' ? 'Farmer' : 'Corporate Buyer'}`);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveModal(null);
    setCancellationState(null);
  };

  // Farmer updates profile
  const updateFarmerProfile = (data) => {
    setFarmerProfile((prev) => ({ ...prev, ...data }));
    addNotification('success', 'Farmer profile details updated successfully!');
  };

  // Mock MahaBhulekh 7/12 Land Verification
  const verifyFarmerLand = (landData) => {
    setFarmerProfile((prev) => ({
      ...prev,
      ...landData,
      isLandVerified: true,
      landDetails: {
        ownerName: 'Verified (Ramesh Maruti Patil)',
        landArea: '2.4 Hectares',
        registeredCrop: 'Onion/Soybean',
        status: 'MahaBhulekh Authenticated 7/12',
        gutNumber: landData.gutNumber || prev.gutNumber
      }
    }));
    addNotification('success', 'MahaBhulekh 7/12 Land Record Verified Successfully! ✅');
  };

  // Buyer updates corporate profile
  const updateBuyerProfile = (data) => {
    setBuyerProfile((prev) => ({ ...prev, ...data }));
    addNotification('success', 'Corporate Procurement profile updated!');
  };

  // Verify Corporate B2B Identity
  const verifyBuyerCorporate = (corpData) => {
    setBuyerProfile((prev) => ({
      ...prev,
      ...corpData,
      isCorporateVerified: true
    }));
    addNotification('success', 'Corporate Identity Verified as Government Partner ✅');
  };

  // Farmer creates a crop listing
  const addCrop = (cropData) => {
    const newId = `crop-${Date.now()}`;
    const newCrop = {
      id: newId,
      ...cropData,
      farmerName: currentUser?.name || farmerProfile.fullName || 'Ramesh Patil',
      farmerPhone: currentUser?.phone || farmerProfile.phone || '+91 98220 14321',
      farmerAadhaar: farmerProfile.aadhaar,
      postedDate: 'Just now',
      status: 'OPEN',
      acceptedBidId: null,
      image: cropData.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
    };

    setCrops((prev) => [newCrop, ...prev]);
    addNotification('success', `Crop listing "${newCrop.name}" created successfully!`);
    return newCrop;
  };

  // Buyer places a counter bid
  const addBid = (bidData) => {
    const newBid = {
      id: `bid-${Date.now()}`,
      cropId: bidData.cropId,
      buyerName: buyerProfile.companyName || currentUser?.name || 'Corporate Buyer',
      buyerContactName: buyerProfile.repName || bidData.buyerContactName || 'Procurement Office',
      buyerPhone: currentUser?.phone || '+91 98900 12345',
      buyerCity: bidData.buyerCity || 'Mumbai Hub',
      buyerAddress: bidData.buyerAddress || 'Plot 42, APMC Market Sector 19, Vashi, Navi Mumbai',
      buyerGstin: buyerProfile.gstinNumber || '27AAACM1234F1Z5',
      bidPrice: Number(bidData.bidPrice),
      pickupDate: bidData.pickupDate,
      timestamp: 'Just now',
      status: 'PENDING'
    };

    setBids((prev) => [newBid, ...prev]);
    addNotification('success', `Counter-bid of ₹${newBid.bidPrice}/Qtl submitted!`);
    return newBid;
  };

  // Farmer accepts a bid -> Launches MahaAgri Escrow Modal
  const acceptBid = (bidId) => {
    const targetBid = bids.find((b) => b.id === bidId);
    if (!targetBid) return;

    const targetCrop = crops.find((c) => c.id === targetBid.cropId);
    const totalAmount = targetBid.bidPrice * (targetCrop?.quantity || 1);
    const govtCessTax = Math.round(totalAmount * 0.01); // 1% Government Cess Tax
    const transactionId = `MH-ESCROW-${Date.now().toString().slice(-6)}`;

    // Update bid status
    setBids((prev) =>
      prev.map((b) => {
        if (b.id === bidId) return { ...b, status: 'ACCEPTED' };
        if (b.cropId === targetBid.cropId && b.id !== bidId) return { ...b, status: 'REJECTED' };
        return b;
      })
    );

    // Update crop status
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === targetBid.cropId) {
          return { ...c, status: 'DEAL_FINALIZED', acceptedBidId: bidId };
        }
        return c;
      })
    );

    // Open Fulfillment Slip Escrow Modal
    setActiveModal({
      type: 'FULFILLMENT_SLIP',
      data: {
        crop: targetCrop,
        bid: targetBid,
        transactionId,
        govtCessTax,
        totalAmount,
        farmerAadhaar: targetCrop?.farmerAadhaar || farmerProfile.aadhaar,
        buyerGstin: targetBid?.buyerGstin || buyerProfile.gstinNumber
      }
    });

    addNotification('success', `Deal Finalized! Escrow Locked 🔒 for ₹${totalAmount.toLocaleString('en-IN')}`);
  };

  // ============================================
  // INSTANT BUY & FIXED PRICE WORKFLOWS
  // ============================================
  const instantBuyFixedPrice = (cropId) => {
    const targetCrop = crops.find((c) => c.id === cropId);
    if (!targetCrop) return;

    const pricePerQtl = targetCrop.fixedPrice || targetCrop.expectedPrice || 2400;
    const totalAmount = pricePerQtl * (targetCrop.quantity || 1);
    const govtCessTax = Math.round(totalAmount * 0.01);
    const transactionId = `MH-FIXED-${Date.now().toString().slice(-6)}`;

    const instantBid = {
      id: `bid-instant-${Date.now()}`,
      cropId,
      buyerName: buyerProfile.companyName || currentUser?.name || 'Mahavira Spices & Foods Pvt Ltd',
      buyerContactName: buyerProfile.repName || 'Procurement Desk',
      buyerPhone: currentUser?.phone || '+91 94221 88990',
      buyerCity: 'Navi Mumbai Hub',
      buyerAddress: 'Plot 42, APMC Market Sector 19, Vashi, Navi Mumbai, Maharashtra',
      buyerGstin: buyerProfile.gstinNumber || '27AAACM1234F1Z5',
      bidPrice: pricePerQtl,
      pickupDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      timestamp: 'Just now',
      status: 'ACCEPTED',
      dealType: 'FIXED_PRICE'
    };

    setBids((prev) => [instantBid, ...prev]);

    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            status: 'SOLD_FIXED',
            statusBadge: 'Sold at Fixed Rate ✅',
            acceptedBidId: instantBid.id
          };
        }
        return c;
      })
    );

    // Launch Escrow Modal immediately
    setActiveModal({
      type: 'FULFILLMENT_SLIP',
      data: {
        crop: targetCrop,
        bid: instantBid,
        transactionId,
        govtCessTax,
        totalAmount,
        farmerAadhaar: targetCrop?.farmerAadhaar || farmerProfile.aadhaar,
        buyerGstin: instantBid.buyerGstin
      }
    });

    addNotification('success', `Instant Buy Confirmed! Locked at ₹${pricePerQtl}/Qtl (Total: ₹${totalAmount.toLocaleString('en-IN')}) 🔒`);
  };

  // Farmer deletes a listing with 0 bids
  const deleteCrop = (cropId) => {
    setCrops((prev) => prev.filter((c) => c.id !== cropId));
    addNotification('info', 'Crop listing removed from marketplace.');
  };

  // Farmer declines an individual pending bid with rapid reason
  const declineBid = (cropId, bidId, reason) => {
    setBids((prev) =>
      prev.map((b) => {
        if (b.id === bidId) return { ...b, status: 'DECLINED', declineReason: reason };
        return b;
      })
    );
    addNotification('warning', `Counter-bid declined (${reason}). Listing remains active.`);
  };

  // ============================================
  // AUCTION ARENA WORKFLOWS
  // ============================================
  const createAuction = (auctionData) => {
    const durationHours = Number(auctionData.durationHours || 2);
    const durationMs = durationHours * 3600 * 1000;
    const newAuction = {
      id: `auction-${Date.now()}`,
      cropName: auctionData.cropName,
      variety: auctionData.variety || 'Grade A Standard',
      quantity: Number(auctionData.quantity) || 100,
      reservePrice: Number(auctionData.reservePrice) || 2000,
      currentHighestBid: Number(auctionData.reservePrice) || 2000,
      highestBidderName: 'Reserve Price (No offers yet)',
      highestBidderGstin: '',
      farmerName: currentUser?.name || farmerProfile.fullName || 'Ramesh Patil',
      farmerPhone: currentUser?.phone || farmerProfile.phone || '+91 98220 14321',
      farmerDistrict: farmerProfile.district || 'Nashik',
      pickupAddress: auctionData.pickupAddress || `${farmerProfile.village || 'Satana'}, ${farmerProfile.district || 'Nashik'}`,
      expiresAt: Date.now() + durationMs,
      image: auctionData.image || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
      status: 'ACTIVE',
      bidsHistory: []
    };

    setAuctions((prev) => [newAuction, ...prev]);
    addNotification('success', `Live Auction for "${newAuction.cropName}" initiated! 🔥`);
    return newAuction;
  };

  const placeAuctionBid = (auctionId, bidAmount) => {
    const bidderName = buyerProfile.companyName || currentUser?.name || 'Mahavira Spices & Foods Pvt Ltd';
    const bidderGstin = buyerProfile.gstinNumber || '27AAACM1234F1Z5';

    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          const newOffer = {
            id: `abid-${Date.now()}`,
            bidderName,
            amount: Number(bidAmount),
            timestamp: 'Just now'
          };
          return {
            ...auc,
            currentHighestBid: Number(bidAmount),
            highestBidderName: bidderName,
            highestBidderGstin: bidderGstin,
            bidsHistory: [newOffer, ...(auc.bidsHistory || [])]
          };
        }
        return auc;
      })
    );

    addNotification('success', `Bid of ₹${bidAmount}/Qtl submitted! You are now the Highest Bidder 🏆`);
  };

  // Proof of Reality Cancellation Modal Open
  const openProofOfRealityModal = (crop) => {
    setProofOfRealityData(crop);
  };

  const closeProofOfRealityModal = () => {
    setProofOfRealityData(null);
  };

  const submitProofOfRealityCancellation = (cropId, evidenceData) => {
    setCrops((prev) =>
      prev.map((c) => {
        if (c.id === cropId) {
          return {
            ...c,
            status: 'CANCEL_REQUESTED',
            statusBadge: 'Cancellation Requested - Awaiting Buyer Response',
            cancellationEvidence: evidenceData
          };
        }
        return c;
      })
    );

    closeProofOfRealityModal();
    addNotification('warning', 'APMC Proof-of-Reality verified! Cancellation request registered awaiting buyer response.');
  };

  // ============================================
  // CANCELLATION GOVERNANCE FUNCTIONS
  // ============================================

  // Step 1: Open the Cancellation Request Modal
  const openCancellationModal = (cropId, bidId) => {
    const crop = crops.find(c => c.id === cropId);
    const bid = bids.find(b => b.id === bidId);

    // Check if there's already a cancellation request for this deal
    const existingRequest = cancellationRequests[cropId];

    if (existingRequest) {
      // If the current user is the initiator, show pending status
      if (existingRequest.initiator === currentUser?.role) {
        setCancellationState({
          phase: 'PENDING_INITIATOR',
          cropId, bidId, crop, bid,
          initiator: existingRequest.initiator,
          reason: existingRequest.reason
        });
      } else {
        // Counter-party sees the approval request
        setCancellationState({
          phase: 'PENDING_COUNTERPARTY',
          cropId, bidId, crop, bid,
          initiator: existingRequest.initiator,
          reason: existingRequest.reason
        });
      }
      return;
    }

    // Check if already disputed or in collusion
    const cropObj = crops.find(c => c.id === cropId);
    if (cropObj?.status === 'DISPUTED') {
      setCancellationState({
        phase: 'DISPUTED',
        cropId, bidId, crop, bid,
        reason: existingRequest?.reason || ''
      });
      return;
    }
    if (cropObj?.status === 'COLLUSION') {
      setCancellationState({
        phase: 'COLLUSION',
        cropId, bidId, crop, bid
      });
      return;
    }

    // New cancellation request
    setCancellationState({
      phase: 'REQUEST',
      cropId, bidId, crop, bid,
      initiator: currentUser?.role || 'farmer'
    });
  };

  // Step 2: Submit Cancellation Request (initiator submits reason + justification)
  const submitCancellationRequest = (cropId, bidId, reason, justification) => {
    // Store the cancellation request
    setCancellationRequests(prev => ({
      ...prev,
      [cropId]: {
        reason,
        justification,
        initiator: currentUser?.role || 'farmer',
        timestamp: new Date().toISOString()
      }
    }));

    // Update crop status to CANCEL_PENDING
    setCrops(prev => prev.map(c => {
      if (c.id === cropId) return { ...c, status: 'CANCEL_PENDING' };
      return c;
    }));

    const crop = crops.find(c => c.id === cropId);
    const bid = bids.find(b => b.id === bidId);

    // Show initiator the pending screen
    setCancellationState({
      phase: 'PENDING_INITIATOR',
      cropId, bidId, crop, bid,
      initiator: currentUser?.role || 'farmer',
      reason
    });

    addNotification('info', t.cancelRequestSentMsg || 'Cancellation request submitted. Waiting for counter-party approval.');
  };

  // Step 3: Counter-party responds (ACCEPT or DISPUTE)
  const respondToCancellation = (cropId, bidId, response) => {
    const crop = crops.find(c => c.id === cropId);
    const bid = bids.find(b => b.id === bidId);

    if (response === 'ACCEPT') {
      // Mutual cancellation - revert deal
      setCrops(prev => prev.map(c => {
        if (c.id === cropId) return { ...c, status: 'OPEN', acceptedBidId: null };
        return c;
      }));
      setBids(prev => prev.map(b => {
        if (b.cropId === cropId) return { ...b, status: 'PENDING' };
        return b;
      }));
      setCancellationRequests(prev => {
        const next = { ...prev };
        delete next[cropId];
        return next;
      });
      setCancellationState(null);
      addNotification('success', t.cancelMutualSuccess || 'Deal cancelled mutually. Escrow funds refunded. No penalties applied.');
    } else if (response === 'DISPUTE') {
      // Dispute - send to APMC arbitrator
      setCrops(prev => prev.map(c => {
        if (c.id === cropId) return { ...c, status: 'DISPUTED' };
        return c;
      }));
      setCancellationState({
        phase: 'DISPUTED',
        cropId, bidId, crop, bid,
        reason: cancellationRequests[cropId]?.reason || ''
      });
      addNotification('warning', t.disputeSentMsg || 'Dispute filed. Case sent to APMC Arbitrator for review.');
    } else if (response === 'COLLUSION') {
      // Collusion detected - administrative lock
      setCrops(prev => prev.map(c => {
        if (c.id === cropId) return { ...c, status: 'COLLUSION' };
        return c;
      }));
      setCancellationState({
        phase: 'COLLUSION',
        cropId, bidId, crop, bid
      });
      addNotification('error', t.collusionDetectedMsg || '🚨 CRITICAL: System collusion detected. Escrow funds under administrative lock.');
    }
  };

  // Legacy cancelDeal for direct cancel (compatibility)
  const cancelDeal = (cropId, bidId) => {
    openCancellationModal(cropId, bidId);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        language,
        setLanguage,
        t,
        farmerProfile,
        updateFarmerProfile,
        verifyFarmerLand,
        buyerProfile,
        updateBuyerProfile,
        verifyBuyerCorporate,
        crops,
        bids,
        auctions,
        mandiPrices,
        ogdMandiApiPayload,
        currentPortalView,
        setCurrentPortalView,
        addCrop,
        addBid,
        acceptBid,
        cancelDeal,
        instantBuyFixedPrice,
        deleteCrop,
        declineBid,
        createAuction,
        placeAuctionBid,
        proofOfRealityData,
        openProofOfRealityModal,
        closeProofOfRealityModal,
        submitProofOfRealityCancellation,
        // Cancellation Governance
        cancellationState,
        setCancellationState,
        cancellationRequests,
        openCancellationModal,
        submitCancellationRequest,
        respondToCancellation,
        notifications,
        addNotification,
        dismissNotification,
        activeModal,
        setActiveModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
