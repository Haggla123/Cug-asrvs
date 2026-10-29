import React from 'react';

interface TopAppBarProps {
  onOpenDrawer: () => void;
  onNavigateHome: () => void;
  onNavigateTrack: () => void;
  onNavigateWizard: () => void;
  onNavigateVerify?: () => void;
  activeRoute?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenDrawer,
  onNavigateHome,
  onNavigateTrack,
  onNavigateWizard,
  onNavigateVerify,
  activeRoute = 'home'
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-outline-variant/60 shadow-xs">
      {/* Top micro institutional bar */}
      <div className="bg-cug-green-dark text-white/90 text-[11px] font-sans px-4 sm:px-6 py-1 border-b border-cug-gold/40 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-cug-gold font-medium">
            <span className="material-symbols-outlined text-[14px]">school</span>
            <span>Catholic University of Ghana • Fiapre-Sunyani</span>
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/80">Office of the Registrar</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:registry@cug.edu.gh" className="hover:text-cug-gold transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">mail</span>
            <span>registry@cug.edu.gh</span>
          </a>
          <span className="text-white/40">|</span>
          <a href="https://cumis.cug.edu.gh" target="_blank" rel="noopener noreferrer" className="text-cug-gold hover:underline font-semibold">
            CUMIS Portal ↗
          </a>
        </div>
      </div>

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
            className="flex items-center gap-3 cursor-pointer select-none group"
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
              <span className="text-label-sm font-label-sm text-outline block leading-none mt-1">
                Academic Services Registry • Fiapre
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
                ? 'bg-cug-green-dark text-white font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={onNavigateWizard}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'wizard'
                ? 'bg-cug-green-dark text-white font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            Request Document
          </button>
          <button
            type="button"
            onClick={onNavigateTrack}
            className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
              activeRoute === 'track'
                ? 'bg-cug-green-dark text-white font-semibold'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            Track Status
          </button>
          {onNavigateVerify && (
            <button
              type="button"
              onClick={onNavigateVerify}
              className={`px-3 py-1.5 rounded-lg text-label-md font-label-md font-medium transition-colors ${
                activeRoute === 'verify'
                  ? 'bg-cug-green-dark text-white font-semibold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              Verification
            </button>
          )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateTrack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant text-primary hover:bg-surface-container transition-colors text-label-sm font-semibold shadow-2xs"
            title="Track existing request"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">timeline</span>
            <span>Track</span>
          </button>

          <button
            type="button"
            onClick={onNavigateWizard}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover active:bg-cug-green-dark font-semibold text-label-sm shadow-xs transition-all"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>New Request</span>
          </button>
        </div>
      </div>
    </header>
  );
};
