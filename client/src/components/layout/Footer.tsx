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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Institutional Authority */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-serif font-bold text-base gold-seal-border">
              C
            </div>
            <div>
              <span className="text-title-md font-serif font-bold text-primary block leading-none">
                Catholic University of Ghana
              </span>
              <span className="text-label-sm font-label-sm text-outline block mt-0.5">
                Academic Services Request &amp; Verification System (ASRVS)
              </span>
            </div>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant max-w-md">
            Official institutional portal for alumni, current students, and verified employers to request official transcripts, English proficiency letters, certificates, and credential authentications.
          </p>
          <div className="text-body-sm font-body-sm flex items-center gap-1.5 text-secondary font-medium">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span>Fiapre-Sunyani Campus, Bono Region, Ghana</span>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 className="text-label-md font-label-md font-bold uppercase tracking-wider text-primary mb-3">
            Academic Services
          </h4>
          <ul className="space-y-2 text-body-sm font-body-sm">
            <li>
              <button type="button" onClick={onNavigateWizard} className="hover:text-primary transition-colors text-left">
                Official Academic Transcript
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateWizard} className="hover:text-primary transition-colors text-left">
                English Proficiency Letter
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateWizard} className="hover:text-primary transition-colors text-left">
                Attestation &amp; Introductory Letters
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateWizard} className="hover:text-primary transition-colors text-left">
                Certified True Copies
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Portal Support */}
        <div>
          <h4 className="text-label-md font-label-md font-bold uppercase tracking-wider text-primary mb-3">
            Registry Support
          </h4>
          <ul className="space-y-2 text-body-sm font-body-sm">
            <li>
              <button type="button" onClick={onNavigateTrack} className="hover:text-primary transition-colors text-left">
                Live Order Tracking
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateVerify} className="hover:text-primary transition-colors text-left">
                External Verification Portal
              </button>
            </li>
            <li>
              <button type="button" onClick={onNavigateHome} className="hover:text-primary transition-colors text-left">
                Fee Schedule &amp; Timelines
              </button>
            </li>
            <li className="pt-1 text-label-sm font-label-sm text-outline">
              Email: registry@cug.edu.gh
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-sm font-label-sm text-outline">
        <div>
          © {new Date().getFullYear()} Catholic University of Ghana. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Data Privacy Compliant (Act 843)</span>
          <span>•</span>
          <span>Institutional Integrity Protected</span>
        </div>
      </div>
    </footer>
  );
};
