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
        {/* Main Footer Grid: 2 columns on phone view, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 mb-8">
          {/* Institutional Authority (Spans both columns on phone view, 2 cols on desktop) */}
          <div className="col-span-2 md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/cug-logo.png"
                alt="Catholic University of Ghana Crest"
                className="w-12 h-12 object-contain drop-shadow-xs shrink-0"
              />
              <div>
                <span className="text-title-md font-serif font-bold text-primary block leading-tight">
                  Catholic University of Ghana
                </span>
                <span className="text-label-sm font-label-sm text-outline block mt-0.5">
                  Academic Services Request &amp; Verification System (ASRVS)
                </span>
              </div>
            </div>

            <p className="text-body-sm font-body-sm text-on-surface-variant max-w-md leading-relaxed">
              Official institutional registry gateway for alumni, current students, and verified employers to request official transcripts, English proficiency certifications, certified copies, and academic credential authentications.
            </p>

            <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-secondary font-semibold">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span>Fiapre-Sunyani Campus, Bono Region, Ghana</span>
            </div>

            <div className="text-[11px] font-mono tracking-wider text-outline uppercase font-semibold">
              Motto: Scientiae ac Sapientiae Lumen Splendeat
            </div>
          </div>

          {/* Column 1 on Phone: Academic Services */}
          <div className="space-y-3">
            <h4 className="text-label-md font-label-md font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1">
              Academic Services
            </h4>
            <ul className="space-y-2 text-body-sm font-body-sm">
              <li>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  Official Transcript
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  English Proficiency
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  Attestation Letters
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  Certified True Copies
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateWizard}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  Recommendation Letter
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2 on Phone: Registry & Support */}
          <div className="space-y-3">
            <h4 className="text-label-md font-label-md font-bold uppercase tracking-wider text-primary border-b border-outline-variant/40 pb-1">
              Registry &amp; Support
            </h4>
            <ul className="space-y-2 text-body-sm font-body-sm">
              <li>
                <button
                  type="button"
                  onClick={onNavigateTrack}
                  className="hover:text-primary transition-colors text-left font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">timeline</span>
                  <span>Track Existing Order</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateVerify}
                  className="hover:text-primary transition-colors text-left font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                  <span>Corporate Verification</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="hover:text-primary transition-colors text-left font-medium"
                >
                  Tariff Schedule
                </button>
              </li>
              <li>
                <span className="text-outline text-label-sm block">Desk Collection:</span>
                <span className="text-primary font-medium text-[12px] block leading-tight">
                  Academic Affairs Office Desk, Fiapre-Sunyani Campus
                </span>
              </li>
              <li className="pt-1 text-label-sm font-label-sm text-outline">
                <span className="block font-medium text-on-surface-variant">Registry Inquiries:</span>
                <a href="mailto:registry@cug.edu.gh" className="text-primary hover:underline font-mono">
                  registry@cug.edu.gh
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-sm font-label-sm text-outline text-center sm:text-left">
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
