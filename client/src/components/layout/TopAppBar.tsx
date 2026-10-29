import React from 'react';

interface TopAppBarProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
  onNavigateTrack: () => void;
  onNavigateWizard: () => void;
  activeRoute?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenDrawer,
  onNavigateHome,
  onNavigateTrack,
  onNavigateWizard,
  activeRoute = 'home'
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Drawer Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open Navigation Menu"
            className="p-2 -ml-2 text-primary hover:bg-surface-container-low rounded-lg transition-colors focus:ring-2 focus:ring-secondary/50"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <img 
              src="/cug-logo.png" 
              alt="Catholic University of Ghana Crest" 
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform shrink-0 drop-shadow-xs" 
            />
            <div>
              <span className="text-title-lg font-serif font-bold tracking-tight text-primary leading-none block">
                CUG ASRVS
              </span>
              <span className="text-label-sm font-label-sm text-outline block leading-none mt-0.5">
                Registry Gateway • Fiapre
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'home'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            Catalogue
          </button>
          <button
            type="button"
            onClick={onNavigateWizard}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'wizard'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            New Request
          </button>
          <button
            type="button"
            onClick={onNavigateTrack}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'track'
                ? 'bg-surface-container text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            Track Status
          </button>
        </nav>

        {/* Right: Security Pill & Quick Action */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low rounded-lg border border-outline-variant/60">
            <span className="material-symbols-outlined text-secondary text-sm">
              verified_user
            </span>
            <span className="text-label-sm font-label-sm text-on-surface font-semibold">
              Official Portal
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateTrack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant text-primary hover:bg-surface-container-high transition-colors text-label-md font-label-md font-medium"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">timeline</span>
            <span className="text-label-sm font-semibold">Track</span>
          </button>
        </div>
      </div>
    </header>
  );
};
