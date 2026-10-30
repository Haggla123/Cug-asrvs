import React from 'react';

interface TopAppBarProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
  onNavigateTrack: () => void;
  onNavigateWizard: () => void;
  onNavigateFinance?: () => void;
  activeRoute?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenDrawer,
  onNavigateHome,
  onNavigateTrack,
  onNavigateWizard,
  onNavigateFinance,
  activeRoute = 'home'
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-cug-green-dark text-white border-b border-cug-gold/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Drawer Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Menu"
            className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg transition-colors focus:ring-2 focus:ring-cug-gold/70"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            aria-label="Catholic University of Ghana home"
            className="flex items-center gap-2.5 cursor-pointer select-none group text-left"
          >
            <img 
              src="/cug-logo.png" 
              alt="Catholic University of Ghana Crest" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform shrink-0 drop-shadow-xs" 
            />
            <div>
              <span className="text-[13px] sm:text-title-md font-serif font-bold tracking-tight text-white leading-tight block">
                Catholic University of Ghana
              </span>
              <span className="text-[10px] sm:text-label-sm font-label-sm text-white/75 block leading-tight mt-0.5">
                Academic Services Request &amp; Verification System
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'home'
                ? 'bg-cug-gold text-cug-green-deep font-semibold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Catalogue
          </button>
          <button
            type="button"
            onClick={onNavigateWizard}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'wizard'
                ? 'bg-cug-gold text-cug-green-deep font-semibold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            New Request
          </button>
          <button
            type="button"
            onClick={onNavigateTrack}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'track'
                ? 'bg-cug-gold text-cug-green-deep font-semibold'
                : 'text-white/85 hover:text-white hover:bg-white/10'
            }`}
          >
            Track Status
          </button>
          {onNavigateFinance && (
            <button
              type="button"
              onClick={onNavigateFinance}
              className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors flex items-center gap-1.5 ${
                activeRoute === 'finance'
                  ? 'bg-cug-gold text-cug-green-deep font-semibold'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">account_balance</span>
              <span>Finance Office</span>
            </button>
          )}
        </nav>

        {/* Right: Security Pill & Quick Action */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg border border-white/20">
            <span className="material-symbols-outlined text-cug-gold text-sm">
              verified_user
            </span>
            <span className="text-label-sm font-label-sm text-white font-semibold">
              Official Portal
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateTrack}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent border border-cug-gold/80 text-white hover:bg-white/10 transition-colors text-label-md font-label-md font-medium"
          >
            <span className="material-symbols-outlined text-[17px] text-cug-gold">timeline</span>
            <span className="text-label-sm font-semibold">Track</span>
          </button>
        </div>
      </div>
    </header>
  );
};
