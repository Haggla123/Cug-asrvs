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
  onNavigateVerify
}) => {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/60 text-on-surface-variant pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Brand row — full width on all breakpoints */}
        <div className="pb-6 mb-6 border-b border-outline-variant/40">
          <div className="flex items-start gap-3">
            <img
              src="/cug-logo.png"
              alt="Catholic University of Ghana Crest"
              className="w-12 h-12 object-contain drop-shadow-xs shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <span className="text-title-md font-serif font-bold text-primary block leading-tight">
                Catholic University of Ghana
              </span>
              <span className="text-label-sm text-outline block mt-0.5">
                Academic Services Request &amp; Verification System (ASRVS)
              </span>
              <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed max-w-lg">
                Official institutional registry gateway for alumni, current students, and verified employers to request official transcripts, English proficiency certifications, certified copies, and academic credential authentications.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                <span className="flex items-center gap-1 text-body-sm text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span>Fiapre-Sunyani Campus, Bono Region, Ghana</span>
                </span>
                <span className="text-[11px] font-mono tracking-wider text-outline uppercase font-semibold hidden sm:block">
                  Scientiae ac Sapientiae Lumen Splendeat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav columns: 2 on phone, 2 on sm (unchanged), 2 + extra space on md */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mb-8">

          {/* Column 1: Academic Services */}
          <div className="space-y-3">
            <h4 className="text-label-md font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1">
              Academic Services
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <button type="button" onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium">
                  Official Transcript
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium">
                  English Proficiency
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium">
                  Attestation Letters
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium">
                  Certified True Copies
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium">
                  Recommendation Letter
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Registry & Support */}
          <div className="space-y-3">
            <h4 className="text-label-md font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1">
              Registry &amp; Support
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <button type="button" onClick={onNavigateTrack}
                  className="hover:text-primary transition-colors text-left font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">timeline</span>
                  <span>Track Existing Order</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateVerify}
                  className="hover:text-primary transition-colors text-left font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                  <span>Corporate Verification</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={onNavigateHome}
                  className="hover:text-primary transition-colors text-left font-medium">
                  Tariff Schedule
                </button>
              </li>
              <li className="space-y-0.5">
                <span className="text-outline text-label-sm block">Desk Collection:</span>
                <span className="text-primary font-medium text-[12px] block leading-snug">
                  Academic Affairs Office Desk,<br className="sm:hidden" /> Fiapre-Sunyani Campus
                </span>
              </li>
              <li className="pt-0.5">
                <span className="block text-label-sm text-on-surface-variant font-medium">Registry Inquiries:</span>
                <a href="mailto:registry@cug.edu.gh"
                  className="text-primary hover:underline font-mono text-[12px]">
                  registry@cug.edu.gh
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-sm text-outline text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Catholic University of Ghana. All rights reserved.
          </div>
          <div className="flex items-center gap-3 justify-center flex-wrap">
            <span>Data Protection Act 843 Compliant</span>
            <span>•</span>
            <span className="text-secondary font-medium">Official Registry Gateway</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
