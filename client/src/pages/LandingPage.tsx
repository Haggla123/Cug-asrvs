import React, { useState } from 'react';
import { INITIAL_SERVICES_CATALOGUE, PICKUP_LOCATION_DEFAULT } from '../lib/constants';
import { formatPesewas } from '../lib/currency';

interface LandingPageProps {
  onStartRequest: () => void;
  onTrackOrder: (ref?: string, identifier?: string) => void;
  onVerifyCredentials: () => void;
}

type ServiceCategory = 'ALL' | 'TRANSCRIPT' | 'CERTIFICATION' | 'ATTESTATION' | 'VERIFICATION';

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartRequest,
  onTrackOrder,
  onVerifyCredentials
}) => {
  const [quickRef, setQuickRef] = useState('');
  const [quickIndex, setQuickIndex] = useState('');
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('ALL');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      onTrackOrder(quickRef.trim(), quickIndex.trim());
    }
  };

  // Filter service items based on active tab
  const filteredServices = INITIAL_SERVICES_CATALOGUE.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'TRANSCRIPT') return item.code === 'TRANSCRIPT';
    if (activeCategory === 'CERTIFICATION') return item.code === 'ENGLISH_PROFICIENCY' || item.code === 'CERTIFIED_COPY';
    if (activeCategory === 'ATTESTATION') return item.code === 'ATTESTATION' || item.code === 'RECOMMENDATION';
    return true;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* =========================================================================
          1. HERO SECTION (Split 2-Column Desktop, Stacked Mobile)
          Matches media_1793284266641.jpg with cug-campus.jpg as hero photo
          ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20 border-b border-outline-variant/60 institutional-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle, CTAs, Quick Track */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Kicker Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-cug-gold/40 text-primary text-label-sm font-semibold tracking-wide shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="uppercase text-[11px] font-bold text-cug-green-dark">
                  Official Registry Gateway • Catholic University of Ghana
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-display-lg-mobile sm:text-display-lg lg:text-5xl font-serif font-bold text-primary tracking-tight leading-[1.15]">
                Your Academic Documents, <br />
                <span className="italic text-secondary font-serif font-medium">Certified &amp; Delivered</span>
              </h1>

              {/* Subtitle */}
              <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Order official academic transcripts, English proficiency certifications, introductory letters, and verified certificate copies without an account. Track your requests in real-time from financial clearance through registrar sealing.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onStartRequest}
                  className="px-7 py-3.5 rounded-xl bg-cug-green text-white hover:bg-cug-green-light active:bg-cug-green-dark font-semibold text-title-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 group"
                >
                  <span className="material-symbols-outlined text-xl">add_circle</span>
                  <span>Start Document Request</span>
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

                <button
                  type="button"
                  onClick={() => onTrackOrder()}
                  className="px-6 py-3.5 rounded-xl border-2 border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-container-low hover:border-cug-gold/60 transition-all font-semibold text-title-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl text-secondary">timeline</span>
                  <span>Track Existing Order</span>
                </button>
              </div>

              {/* Quick Tracking Search Box (Integrated inside hero) */}
              <div className="pt-2">
                <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/80 shadow-md max-w-xl">
                  <div className="text-left mb-2.5 px-1 flex items-center justify-between">
                    <span className="text-label-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                      <span>Quick Request Status Lookup</span>
                    </span>
                    <span className="text-[11px] font-medium text-secondary">Zero Login Required</span>
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
                        className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-cug-green focus:bg-surface-container-lowest transition-colors text-sm"
                      />
                    </div>

                    <div className="w-full sm:w-44 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-lg">badge</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Index / Phone"
                        value={quickIndex}
                        onChange={e => setQuickIndex(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-body-md font-mono focus:border-cug-green focus:bg-surface-container-lowest transition-colors text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-hover active:scale-98 transition-all font-semibold text-label-md shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Track</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: Framed Campus Photo with Floating Badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative background aura */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-cug-green/20 via-cug-gold/20 to-transparent rounded-3xl blur-lg transform -rotate-1 pointer-events-none" />

                {/* Main Hero Campus Image */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-cug-gold/40 shadow-2xl bg-surface-container-low">
                  <img
                    src="/cug-campus.jpg"
                    alt="Catholic University of Ghana Fiapre-Sunyani Campus"
                    className="w-full h-80 sm:h-96 lg:h-[430px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cug-green-dark/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Top Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-[12px] font-bold text-cug-green-dark border border-cug-gold/50">
                      <img src="/cug-logo.png" alt="CUG" className="w-5 h-5 object-contain" />
                      <span>Fiapre-Sunyani Campus</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-cug-green-dark/90 backdrop-blur-md text-cug-gold text-[11px] font-mono font-semibold uppercase tracking-wider">
                      Est. 2003
                    </span>
                  </div>

                  {/* Floating Bottom Card Over Photo */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-outline-variant shadow-lg text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cug-green/10 text-cug-green flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl">verified</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-title-sm font-bold text-primary block truncate">
                          Academic Affairs Registry Desk
                        </span>
                        <span className="text-[12px] text-on-surface-variant block truncate">
                          Embossed Institutional Seal &amp; Anti-Tamper Security
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STATS / IMPACT METRICS STRIP (4 Key Pillar Cards)
          Matches the 4-card metric row in media_1793284266641.jpg
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-md hover:shadow-lg transition-shadow text-left flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cug-green/10 text-cug-green flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <div>
              <span className="text-title-md font-bold text-primary block">
                Official Registry Desk
              </span>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-snug">
                Academic Affairs Office Desk, Fiapre-Sunyani Campus or express DHL courier.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-md hover:shadow-lg transition-shadow text-left flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div>
              <span className="text-title-md font-bold text-primary block">
                5 Core Services
              </span>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-snug">
                Transcripts, English proficiencies, attestations, copies, and references.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-md hover:shadow-lg transition-shadow text-left flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cug-green/10 text-cug-green flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <span className="text-title-md font-bold text-primary block">
                100% Cryptographic
              </span>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-snug">
                Registrar embossed seal combined with tamper-evident digital QR codes.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/80 shadow-md hover:shadow-lg transition-shadow text-left flex flex-col justify-between space-y-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">bolt</span>
            </div>
            <div>
              <span className="text-title-md font-bold text-primary block">
                Zero Account Needed
              </span>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-snug">
                Fast MoMo &amp; Card checkout with live SMS milestone updates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. EXPLORE OUR ACADEMIC SERVICES (Filterable Service Grid)
          Matches "Explore Our Academic Programs" in media_1793284266641.jpg
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/60 pb-6">
          <div className="space-y-2 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-label-sm font-label-sm text-secondary uppercase font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span>Academic Services &amp; Tariff Schedule</span>
            </div>
            <h2 className="text-headline-sm sm:text-headline-md font-serif font-bold text-primary">
              Explore Official Document Services
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Every document is issued according to approved Catholic University of Ghana standards with institutional seals and signatures.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartRequest}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-cug-green text-white hover:bg-cug-green-light active:bg-cug-green-dark text-label-md font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Start Document Request</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'ALL' as ServiceCategory, label: 'All Services' },
            { id: 'TRANSCRIPT' as ServiceCategory, label: 'Transcripts' },
            { id: 'CERTIFICATION' as ServiceCategory, label: 'Certifications' },
            { id: 'ATTESTATION' as ServiceCategory, label: 'Attestation & References' },
            { id: 'VERIFICATION' as ServiceCategory, label: 'Corporate Verification' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-label-md font-medium whitespace-nowrap transition-all ${
                activeCategory === tab.id
                  ? 'bg-cug-green-dark text-white font-semibold shadow-xs'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 text-left group hover:border-cug-gold/60"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cug-green/10 text-cug-green flex items-center justify-center group-hover:bg-cug-green group-hover:text-white transition-colors">
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
                  <div className="text-right">
                    <span className="text-title-lg font-mono font-bold text-primary block">
                      {formatPesewas(item.basePricePesewas)}
                    </span>
                    <span className="text-[11px] text-outline uppercase font-semibold">
                      Per Copy
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/40 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary uppercase tracking-wider bg-secondary-container/60 px-2.5 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{item.badgeText ? item.badgeText : 'Embossed & Sealed'}</span>
                </span>
                
                <button
                  type="button"
                  onClick={onStartRequest}
                  className="text-label-md font-semibold text-primary hover:text-secondary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Request</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </article>
          ))}

          {/* Third Party Verification Card (Always shown in catalogue) */}
          {(activeCategory === 'ALL' || activeCategory === 'VERIFICATION') && (
            <article className="bg-surface-container-low rounded-2xl p-6 border-2 border-secondary/40 shadow-xs flex flex-col justify-between space-y-5 text-left">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 text-cug-green-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">shield</span>
                  </div>
                  <div className="text-right">
                    <span className="text-title-lg font-mono font-bold text-cug-green-dark block">
                      GHS 200.00
                    </span>
                    <span className="text-[11px] text-outline uppercase font-semibold">
                      Per Candidate
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-title-md font-bold text-primary">
                    Corporate &amp; Embassy Verification
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Direct validation service for corporate employers, embassies, and academic credential evaluators (WES, ECE) verifying candidate credentials.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={onVerifyCredentials}
                  className="w-full py-2.5 px-4 rounded-xl bg-cug-green-dark text-white hover:bg-cug-green font-semibold text-label-md text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm text-secondary">verified</span>
                  <span>Submit Verification Inquiry</span>
                </button>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. FEATURE SHOWCASE (Dark Forest Green Section #003318)
          Matches "A Place to Learn, Grow and Belong" in media_1793284266641.jpg
          ========================================================================= */}
      <section className="bg-cug-green-dark text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 border border-cug-gold/30 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Framed campus photo */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border-2 border-cug-gold/60 shadow-xl">
                <img
                  src="/cug-campus.jpg"
                  alt="Catholic University of Ghana Architecture"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white text-cug-green-dark px-4 py-2 rounded-xl shadow-lg border border-cug-gold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">local_police</span>
                <span className="text-label-sm font-bold">Fiapre-Sunyani Campus</span>
              </div>
            </div>

            {/* Right: Text and values */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-cug-gold text-label-sm font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>About CUG Academic Registry</span>
              </div>

              <h2 className="text-display-lg-mobile sm:text-headline-lg font-serif font-bold text-white tracking-tight leading-snug">
                Uncompromising Standards in Academic Record Keeping &amp; Credential Integrity
              </h2>

              <p className="text-body-md text-white/80 leading-relaxed">
                Since our founding, Catholic University of Ghana has prioritized academic rigor and ethical governance. The Academic Affairs Directorate ensures all official documents undergo rigorous cross-verification against institutional archives before seal application.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                  <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
                  <h4 className="text-label-md font-bold text-white">Registry Sealed</h4>
                  <p className="text-[12px] text-white/70">Embossed institutional seal on all transcripts.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                  <span className="material-symbols-outlined text-secondary text-2xl">local_shipping</span>
                  <h4 className="text-label-md font-bold text-white">Global Dispatch</h4>
                  <p className="text-[12px] text-white/70">Campus desk pickup or express DHL courier worldwide.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-1">
                  <span className="material-symbols-outlined text-secondary text-2xl">qr_code_2</span>
                  <h4 className="text-label-md font-bold text-white">Cryptographic QR</h4>
                  <p className="text-[12px] text-white/70">Instant live authenticity check for employers &amp; WES.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onStartRequest}
                  className="px-6 py-3 rounded-xl bg-cug-gold text-cug-green-deep hover:bg-cug-gold-hover font-bold text-label-md shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Request Official Documents</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE 4-STAGE REQUEST JOURNEY ("How It Works")
          Matches "Our Impact / Real Stories" section in template
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-label-sm font-label-sm text-secondary uppercase font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span>Transparent Order Lifecycle</span>
          </div>
          <h2 className="text-headline-sm sm:text-headline-md font-serif font-bold text-primary">
            How It Works: 4 Steps from Request to Fulfillment
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Track each milestone of your request with instant SMS notifications and live online status verification.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Request & Pay',
              desc: 'Select your required documents, specify delivery preferences, and complete secure MoMo or Card checkout without needing an account.'
            },
            {
              step: '02',
              title: 'Financial Clearance',
              desc: 'The CUG Finance Directorate automatically verifies your student account balance and issues institutional financial clearance.'
            },
            {
              step: '03',
              title: 'Records & Seal',
              desc: 'The Academic Affairs records team pulls your historical dossier, prepares the certified documents, and affixes the embossed seal.'
            },
            {
              step: '04',
              title: 'Fulfillment & Dispatch',
              desc: `Collect in person at ${PICKUP_LOCATION_DEFAULT}, receive secure PDF by email, or track express DHL courier to your doorstep.`
            }
          ].map((s) => (
            <div
              key={s.step}
              className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-xs hover:shadow-md transition-shadow space-y-3 text-left relative group hover:border-cug-gold/60"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-extrabold text-secondary">
                  {s.step}
                </span>
                <span className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center text-sm font-semibold">
                  ✓
                </span>
              </div>
              <h3 className="text-title-md font-bold text-primary">
                {s.title}
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          6. CORPORATE / EMBASSY VERIFICATION SECTION
          ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-surface-container-low rounded-3xl p-6 sm:p-10 border border-cug-gold/40 shadow-md text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest text-secondary text-label-sm font-bold border border-outline-variant/60 uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">domain_verification</span>
              <span>For Employers, Embassies &amp; WES</span>
            </div>
            <h3 className="text-headline-sm font-serif font-bold text-primary">
              Need to Authenticate a CUG Candidate&apos;s Credentials?
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Third-party background verification agencies and international evaluators can submit candidate reference numbers directly to Academic Affairs for prompt confirmation.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={onVerifyCredentials}
              className="px-6 py-3.5 rounded-xl bg-cug-green text-white hover:bg-cug-green-light font-semibold text-title-sm transition-all shadow-md text-center flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg text-secondary">verified</span>
              <span>Verify Candidate</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PRE-FOOTER CALL TO ACTION (CTA BANNER)
          Matches bottom banner in media_1793284266641.jpg
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-cug-green-dark border-2 border-cug-gold/40 shadow-2xl p-8 sm:p-14 text-center text-white">
          {/* Background image tint */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" 
            style={{ backgroundImage: `url('/cug-campus.jpg')` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cug-green-deep/90 via-cug-green-dark/95 to-cug-green-deep/90 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <img 
              src="/cug-logo.png" 
              alt="Catholic University of Ghana Crest" 
              className="w-16 h-16 object-contain mx-auto drop-shadow-md"
            />
            
            <h2 className="text-headline-md sm:text-display-md font-serif font-bold text-white tracking-tight">
              Ready to Order Your Academic Documents?
            </h2>

            <p className="text-body-lg text-white/85 max-w-xl mx-auto leading-relaxed">
              Submit your request online in minutes. No prior account registration required. Pay securely and track progress from any device.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onStartRequest}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cug-gold text-cug-green-deep hover:bg-cug-gold-hover active:scale-98 font-bold text-title-sm shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <span>Start Document Request Now</span>
              </button>

              <button
                type="button"
                onClick={() => onTrackOrder()}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl border-2 border-white/30 text-white hover:bg-white/10 active:scale-98 font-semibold text-title-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl text-secondary">timeline</span>
                <span>Track Existing Order</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
