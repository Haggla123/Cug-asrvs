import React from 'react';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateWizard?: () => void;
  onNavigateTrack?: () => void;
  onNavigateVerify?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateWizard,
  onNavigateTrack,
  onNavigateVerify,
}) => (
  <footer className="bg-cug-green-dark text-white border-t-4 border-cug-gold">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      {/* Mobile: 1 col then 2 col; Tablet+: 4 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 mb-8">

        {/* COL 1 — Institutional identity */}
        <div className="sm:col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/cug-logo.png"
              alt="CUG Crest"
              className="w-11 h-11 object-contain shrink-0 opacity-90"
            />
            <div>
              <p className="font-serif font-bold text-white leading-tight text-[15px]">
                Catholic University<br />of Ghana
              </p>
            </div>
          </div>
          <p className="text-white/70 text-[12px] leading-relaxed">
            Academic Services Request &amp; Verification System (ASRVS) — official registry gateway for document requests and credential authentication.
          </p>
          <div className="flex items-center gap-1.5 text-cug-gold text-[12px] font-semibold">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            Fiapre-Sunyani Campus, Bono Region
          </div>
          <p className="text-[11px] text-white/45 font-mono italic">
            Scientiae ac Sapientiae Lumen Splendeat
          </p>
        </div>

        {/* COL 2 — Academic Services */}
        <div className="space-y-3">
          <h4 className="text-cug-gold text-[11px] font-bold uppercase tracking-widest border-b border-white/15 pb-1.5">
            Academic Services
          </h4>
          <ul className="space-y-2 text-[13px] text-white/75">
            {[
              'Official Transcript',
              'English Proficiency Letter',
              'Attestation / Intro Letter',
              'Certified True Copy',
              'Recommendation Letter',
            ].map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-cug-gold transition-colors text-left"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* COL 3 — Portal Links */}
        <div className="space-y-3">
          <h4 className="text-cug-gold text-[11px] font-bold uppercase tracking-widest border-b border-white/15 pb-1.5">
            Portals &amp; Tools
          </h4>
          <ul className="space-y-2 text-[13px] text-white/75">
            <li>
              <button type="button" onClick={onNavigateHome}
                className="hover:text-cug-gold transition-colors text-left flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">home</span> Home
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateWizard}
                className="hover:text-cug-gold transition-colors text-left flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">add_circle</span> New Request
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateTrack}
                className="hover:text-cug-gold transition-colors text-left flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">timeline</span> Track Order
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateVerify}
                className="hover:text-cug-gold transition-colors text-left flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">verified</span> Credential Verification
              </button>
            </li>
          </ul>
        </div>

        {/* COL 4 — Contact & Collection */}
        <div className="space-y-3">
          <h4 className="text-cug-gold text-[11px] font-bold uppercase tracking-widest border-b border-white/15 pb-1.5">
            Contact &amp; Collection
          </h4>
          <ul className="space-y-3 text-[13px] text-white/75">
            <li>
              <span className="text-white/45 text-[11px] uppercase tracking-wider block">Desk Collection</span>
              <span className="text-white/85 font-medium leading-snug">
                Academic Affairs Office Desk,<br />Fiapre-Sunyani Campus
              </span>
            </li>
            <li>
              <span className="text-white/45 text-[11px] uppercase tracking-wider block">Registry Email</span>
              <a href="mailto:registry@cug.edu.gh"
                className="text-cug-gold hover:underline font-mono text-[12px]">
                registry@cug.edu.gh
              </a>
            </li>
            <li>
              <span className="text-white/45 text-[11px] uppercase tracking-wider block">Institution Website</span>
              <a href="https://www.cug.edu.gh" target="_blank" rel="noreferrer"
                className="text-cug-gold hover:underline text-[12px]">
                www.cug.edu.gh
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/15 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/45">
        <span>© {new Date().getFullYear()} Catholic University of Ghana. All rights reserved.</span>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span>Data Protection Act 843 Compliant</span>
          <span className="text-white/25">•</span>
          <span className="text-cug-gold font-medium">Official Registry Gateway</span>
          <span className="text-white/25">•</span>
          <span>Prototype Build</span>
        </div>
      </div>

    </div>
  </footer>
);
