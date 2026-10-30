import React, { useState } from 'react';
import { TopAppBar } from './components/layout/TopAppBar';
import { NavigationDrawer } from './components/layout/NavigationDrawer';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { RequestWizardPage } from './pages/RequestWizardPage';
import { TrackingPage } from './pages/TrackingPage';
import { VerificationView } from './features/verification/VerificationView';
import { StaffDemoView } from './features/administration/StaffDemoView';
import { FinanceOfficeView } from './features/administration/FinanceOfficeView';

type AppRoute = 'home' | 'wizard' | 'track' | 'verify' | 'staff' | 'finance';

export const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trackingParams, setTrackingParams] = useState<{ ref?: string; identifier?: string }>({});

  const handleNavigateHome = () => {
    setActiveRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWizard = () => {
    setActiveRoute('wizard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateTrack = (ref?: string, identifier?: string) => {
    if (ref || identifier) {
      setTrackingParams({ ref, identifier });
    }
    setActiveRoute('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateVerify = () => {
    setActiveRoute('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateStaffDemo = () => {
    setActiveRoute('staff');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFinance = () => {
    setActiveRoute('finance');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-sans selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Institutional Top App Bar */}
      <TopAppBar
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateTrack={() => handleNavigateTrack()}
        onNavigateWizard={handleNavigateWizard}
        activeRoute={activeRoute}
      />

      {/* Slide-over Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateHome={handleNavigateHome}
        onNavigateWizard={handleNavigateWizard}
        onNavigateTrack={() => handleNavigateTrack()}
        onNavigateVerify={handleNavigateVerify}
        onNavigateStaffDemo={handleNavigateStaffDemo}
        onNavigateFinance={handleNavigateFinance}
        activeRoute={activeRoute}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full">
        {activeRoute === 'home' && (
          <LandingPage
            onStartRequest={handleNavigateWizard}
            onTrackOrder={handleNavigateTrack}
            onVerifyCredentials={handleNavigateVerify}
          />
        )}

        {activeRoute === 'wizard' && (
          <RequestWizardPage
            onCancel={handleNavigateHome}
          />
        )}

        {activeRoute === 'track' && (
          <TrackingPage
            initialRef={trackingParams.ref}
            initialIdentifier={trackingParams.identifier}
            onNewRequest={handleNavigateWizard}
          />
        )}

        {activeRoute === 'verify' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
            <VerificationView />
          </div>
        )}

        {activeRoute === 'staff' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
            <StaffDemoView />
          </div>
        )}

        {activeRoute === 'finance' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
            <FinanceOfficeView />
          </div>
        )}
      </main>

      {/* Institutional Footer */}
      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateWizard={handleNavigateWizard}
        onNavigateTrack={() => handleNavigateTrack()}
        onNavigateVerify={handleNavigateVerify}
      />
    </div>
  );
};

export default App;
