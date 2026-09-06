import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LeftSidebar } from './components/LeftSidebar';
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerPortal } from './components/BuyerPortal';
import { MandiPricesView } from './components/MandiPricesView';
import { SettingsView } from './components/SettingsView';
import { EscrowModal } from './components/EscrowModal';
import { CancellationModal } from './components/CancellationModal';
import { ProofOfRealityModal } from './components/ProofOfRealityModal';
import { NotificationToast } from './components/NotificationToast';

const MainApp = () => {
  const { currentUser, t } = useApp();
  const [currentView, setCurrentView] = useState('MAIN'); // 'MAIN' | 'MANDI' | 'PROFILE' | 'SETTINGS'

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Left Navigation Sidebar */}
      <LeftSidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col justify-between overflow-x-hidden min-w-0">
        <div>
          <Header />

          {/* View Router */}
          {currentView === 'MANDI' ? (
            <MandiPricesView />
          ) : currentView === 'SETTINGS' ? (
            <SettingsView />
          ) : currentView === 'PROFILE' ? (
            currentUser.role === 'farmer' ? (
              <FarmerDashboard initialTab="FARMER_PROFILE" />
            ) : (
              <BuyerPortal initialTab="BUYER_PROFILE" />
            )
          ) : currentUser.role === 'farmer' ? (
            <FarmerDashboard />
          ) : (
            <BuyerPortal />
          )}
        </div>

        {/* Global Modals & Toast Notifications */}
        <EscrowModal />
        <CancellationModal />
        <ProofOfRealityModal />
        <NotificationToast />

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-center text-xs">
          <p>{t.footerText}</p>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
