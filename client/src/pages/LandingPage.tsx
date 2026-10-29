import React, { useState } from 'react';
import { INITIAL_SERVICES_CATALOGUE } from '../lib/constants';
import { formatPesewas } from '../lib/currency';

interface LandingPageProps {
  onStartRequest: () => void;
  onTrackOrder: (ref?: string, identifier?: string) => void;
  onVerifyCredentials: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRequest,
  onTrackOrder,
  onVerifyCredentials
}) => {
  const [quickRef, setQuickRef] = useState('');
  const [quickIndex, setQuickIndex] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      onTrackOrder(quickRef.trim(), quickIndex.trim());
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 institutional-mesh border-b border-outline-variant/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/60 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            <span>Office of the Registrar • Fiapre-Sunyani</span>
          </div>

          <h1 className="text-display-lg-mobile sm:text-display-lg font-serif font-bold text-primary tracking-tight leading-tight max-w-3xl mx-auto">
            Academic Services Request &amp; Verification System
          </h1>

          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Order official academic transcripts, English proficiency certifications, introductory letters, and verified certificate copies without an account. Track your requests in real-time from financial clearance through registrar sealing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onStartRequest}
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:bg-primary font-title-sm font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span>Start New Document Request</span>
            </button>

            <button
              type="button"
              onClick={() => onTrackOrder()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-container transition-all font-title-sm font-medium flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">timeline</span>
              <span>Track Existing Order</span>
            </button>
          </div>

          {/* Quick Tracking Search Box */}
          <div className="max-w-2xl mx-auto pt-6">
            <form onSubmit={handleQuickTrack} className="bg-surface-container-lowest p-3 sm:p-4 rounded-2xl border border-outline-variant/80 shadow-md flex flex-col sm:flex-row items-center gap-2.5">
              <div className="w-full sm:flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-lg">search</span>
                </div>
                <input
                  type="text"
                  placeholder="Order Reference (e.g. CUG-REQ-2026-8941)"
                  value={quickRef}
                  onChange={e => setQuickRef(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-primary"
                />
              </div>

              <div className="w-full sm:w-48 relative">
                <input
                  type="text"
                  placeholder="Index / Phone"
                  value={quickIndex}
                  onChange={e => setQuickIndex(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-secondary text-white hover:bg-secondary-container hover:text-on-secondary-container transition-colors font-semibold text-label-md shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>Track</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOGUE CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-label-sm font-label-sm text-secondary uppercase font-bold tracking-wider">
            Official Registry Catalogue
          </span>
          <h2 className="text-headline-sm sm:text-headline-md font-serif font-bold text-primary">
            Academic Services &amp; Tariff Schedule
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            All documents are prepared according to approved university registry standards with official institutional embossed seals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SERVICES_CATALOGUE.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/60 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">
                      {item.code === 'TRANSCRIPT'
                        ? 'school'
                        : item.code === 'ENGLISH_PROFICIENCY'
                        ? 'translate'
                        : item.code === 'ATTESTATION'
                        ? 'assignment'
                        : item.code === 'CERTIFIED_COPY'
                        ? 'verified'
                        : 'recommend'}
                    </span>
                  </div>
                  <span className="text-title-md font-mono font-bold text-primary">
                    {formatPesewas(item.basePricePesewas)}
                  </span>
                </div>

                <h3 className="text-title-md font-title-md font-bold text-on-surface">
                  {item.title}
                </h3>

                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="text-label-sm text-outline">
                  {item.badgeText ? item.badgeText : 'Embossed & Sealed'}
                </span>
                <button
                  type="button"
                  onClick={onStartRequest}
                  className="text-label-sm font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>Request Document</span>
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </article>
          ))}

          {/* Third Party Verification Card */}
          <article className="bg-surface-container-low rounded-2xl p-6 border border-secondary/30 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">shield</span>
              </div>
              <h3 className="text-title-md font-title-md font-bold text-primary">
                Corporate Verification Portal
              </h3>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                For corporate employers, embassies, and academic credential evaluators (WES, ECE) verifying candidate credentials.
              </p>
            </div>
            <div className="pt-3 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={onVerifyCredentials}
                className="w-full py-2 px-3 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors text-label-md font-semibold text-center block"
              >
                Submit Verification Inquiry
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-surface-container-low py-12 border-y border-outline-variant/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-label-sm font-label-sm text-secondary uppercase font-bold tracking-wider">
              Transparent Lifecycle
            </span>
            <h2 className="text-headline-sm font-serif font-bold text-primary">
              The 4-Stage Request Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Request & Pay',
                desc: 'Fill your student details, choose document quantities, and pay securely via MoMo or Card.'
              },
              {
                step: '02',
                title: 'Financial Clearance',
                desc: 'The CUG Finance Office checks your institutional account and grants clearance.'
              },
              {
                step: '03',
                title: 'Records & Seal',
                desc: 'The Records Office pulls your archive docket and the Academic Registrar signs and seals.'
              },
              {
                step: '04',
                title: 'Fulfillment',
                desc: 'Collect at Fiapre Desk Room 104, receive PDF by email, or track express courier dispatch.'
              }
            ].map((s) => (
              <div key={s.step} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/60 shadow-xs space-y-2">
                <span className="font-mono text-headline-sm font-bold text-secondary/70">
                  {s.step}
                </span>
                <h3 className="text-title-sm font-bold text-primary">
                  {s.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
