import React from 'react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateWizard: () => void;
  onNavigateTrack: () => void;
  onNavigateVerify: () => void;
  onNavigateStaffDemo: () => void;
  activeRoute: string;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateWizard,
  onNavigateTrack,
  onNavigateVerify,
  onNavigateStaffDemo,
  activeRoute
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-tertiary/60 backdrop-blur-xs z-50 transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside 
        className="fixed inset-y-0 left-0 z-50 flex flex-col p-4 w-80 max-w-[85vw] bg-surface-container-lowest shadow-2xl border-r border-outline-variant transition-transform animate-slide-right"
        role="dialog"
        aria-label="Navigation Menu"
      >
        {/* Header */}
        <div className="pb-4 border-b border-outline-variant mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-sm gold-seal-border">
              <span className="material-symbols-outlined text-[26px]">school</span>
            </div>
            <button 
              type="button"
              className="p-1 text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container-low transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
          <h2 className="text-title-lg font-serif font-bold text-primary">
            Academic Services Registry
          </h2>
          <p className="text-body-sm font-body-sm text-on-surface">
            Catholic University of Ghana
          </p>
          <span className="text-label-sm font-label-sm text-secondary font-medium block mt-0.5">
            Sunyani - Fiapre Campus
          </span>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onNavigateWizard(); onClose(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-label-md font-label-md transition-colors ${
              activeRoute === 'wizard'
                ? 'bg-primary-container text-white font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>New Academic Request</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigateTrack(); onClose(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-label-md font-label-md transition-colors ${
              activeRoute === 'track'
                ? 'bg-primary-container text-white font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">timeline</span>
            <span>Track Existing Request</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigateHome(); onClose(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-label-md font-label-md transition-colors ${
              activeRoute === 'home'
                ? 'bg-primary-container text-white font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            <span>Fee Schedule &amp; Catalogue</span>
          </button>

          <button
            type="button"
            onClick={() => { onNavigateVerify(); onClose(); }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-label-md font-label-md transition-colors ${
              activeRoute === 'verify'
                ? 'bg-primary-container text-white font-semibold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span>External Verification</span>
          </button>

          <div className="pt-2 border-t border-outline-variant/60 my-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-outline px-3 mb-1 block">
              University Staff
            </span>
            <button
              type="button"
              onClick={() => { onNavigateStaffDemo(); onClose(); }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left text-label-md font-label-md transition-colors ${
                activeRoute === 'staff'
                  ? 'bg-primary-container text-white font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span>Staff Processing Portal</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="pt-4 border-t border-outline-variant text-center">
          <p className="text-label-sm font-label-sm text-outline">
            ASRVS Secure Architecture v1.0
          </p>
          <p className="text-label-sm font-label-sm text-secondary font-medium mt-0.5">
            Office of the Registrar © 2026
          </p>
        </div>
      </aside>
    </>
  );
};
