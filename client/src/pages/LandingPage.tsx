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
      {/* HERO SECTION — glassy campus-photo background */}
      <section className="relative overflow-hidden border-b border-white/20 min-h-[377px] sm:min-h-[429px] flex items-center">

        {/* 1. Campus photo layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/cug-campus.jpg')" }}
          aria-hidden="true"
        />

        {/* 2. Very light dark tint — lets the photo breathe */}
        <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

        {/* 3. Subtle green colour cast from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-cug-green-dark/60 via-transparent to-transparent" aria-hidden="true" />

        {/* 4. Glass content card */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl px-6 py-10 sm:px-10 sm:py-14 shadow-2xl text-center space-y-7">

            {/* Crest + kicker */}
            <div className="flex flex-col items-center gap-3">
              <img
                src="/cug-logo.png"
                alt="Catholic University of Ghana Crest"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mx-auto"
              />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cug-gold/20 backdrop-blur-sm border border-cug-gold/50 text-cug-gold text-label-sm font-bold uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>Office of the Registrar • Fiapre-Sunyani</span>
              </div>
            </div>

            {/* Headline — white with strong text shadow for pop */}
            <h1
              className="text-display-lg-mobile sm:text-display-lg font-serif font-bold text-white tracking-tight leading-tight max-w-3xl mx-auto"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}
            >
              Academic Services Request &amp; Verification System
            </h1>

            {/* Subtitle — off-white, still clearly readable */}
            <p
              className="text-body-lg font-body-lg text-white/90 max-w-2xl mx-auto leading-relaxed"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.45)' }}
            >
              Order official academic transcripts, English proficiency certifications, introductory letters, and verified certificate copies without an account. Track your requests in real-time from financial clearance through registrar sealing.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartRequest}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cug-gold text-cug-green-dark hover:bg-cug-gold-hover active:scale-[0.98] font-title-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <span>Start New Document Request</span>
              </button>

              <button
                type="button"
                onClick={() => onTrackOrder()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border-2 border-white/60 bg-white/15 backdrop-blur-sm text-white font-title-sm font-semibold hover:bg-white/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
              >
                <span className="material-symbols-outlined text-xl">timeline</span>
                <span>Track Existing Order</span>
              </button>
            </div>

            {/* Quick Tracking Search Box — opaque card inside the glass card */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl border border-white/80 shadow-xl">
                <div className="text-left mb-2.5 px-1 flex items-center justify-between">
                  <span className="text-label-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                    <span>Quick Request Status Lookup</span>
                  </span>
                  <span className="text-[11px] text-outline">No login required</span>
                </div>

                <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="w-full sm:flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-lg">search</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Order Reference (e.g. CUG-REQ-2026-8941)"
                      value={quickRef}
                      onChange={e => setQuickRef(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-primary focus:bg-surface-container-lowest transition-colors text-on-surface"
                    />
                  </div>

                  <div className="w-full sm:w-52 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-lg">badge</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Index / Phone"
                      value={quickIndex}
                      onChange={e => setQuickIndex(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-primary focus:bg-surface-container-lowest transition-colors text-on-surface"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-cug-green text-white hover:bg-cug-green-light active:scale-[0.98] transition-all font-semibold text-label-md shrink-0 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Track</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>

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
                desc: 'Collect at Academic Affairs Office Desk, Fiapre-Sunyani Campus, receive PDF by email, or track express courier dispatch.'
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
