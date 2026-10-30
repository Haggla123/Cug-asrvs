import React from 'react';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateWizard?: () => void;
  onNavigateTrack?: () => void;
  onNavigateVerify?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
}) => (
  <footer className="border-t-[3px] border-cug-gold bg-cug-green-dark text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Institutional Identity & System Notice */}
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateHome}
              className="font-serif text-title-sm font-bold tracking-tight text-white hover:text-cug-gold transition-colors text-left"
            >
              Catholic University of Ghana
            </button>
            <span className="text-cug-gold/60 text-xs">•</span>
            <span className="text-[12px] text-cug-gold font-medium">ASRVS</span>
          </div>
          <p className="text-[11px] text-white/75 leading-tight">
            Academic Services Request &amp; Verification System — Office of the Registrar
          </p>
          <p className="text-[11px] text-white/60 leading-relaxed pt-0.5">
            Institutional verification gateway. All document requests and payment proofs are audited and confirmed by university staff before processing.
          </p>
        </div>

        {/* Right Side: Campus Location, Collection Desk & Contact */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-1 text-[11px] text-white/80 shrink-0">
          <div className="flex items-center gap-1.5 font-medium text-white/90">
            <span className="material-symbols-outlined text-[15px] text-cug-gold">location_on</span>
            <span>Fiapre-Sunyani Campus, Bono Region</span>
          </div>
          <div className="text-white/70">
            Desk: <span className="text-white/90 font-medium">Academic Affairs Office Desk</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 text-white/60">
            <a href="mailto:registry@cug.edu.gh" className="text-cug-gold hover:underline">
              registry@cug.edu.gh
            </a>
            <span>•</span>
            <span>© {new Date().getFullYear()} CUG</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
