import React, { useState, useEffect } from 'react';
import { TariffStorage } from '../lib/tariffStorage';
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
  const [servicesCatalogue, setServicesCatalogue] = useState(() => TariffStorage.getServicesCatalogue());

  useEffect(() => {
    const handleTariffsChanged = () => {
      setServicesCatalogue(TariffStorage.getServicesCatalogue());
    };
    window.addEventListener('cug_tariffs_updated', handleTariffsChanged);
    return () => window.removeEventListener('cug_tariffs_updated', handleTariffsChanged);
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* HERO SECTION — glassy campus-photo background */}
      <section className="relative isolate overflow-hidden border-b border-cug-gold/70 min-h-[410px] sm:min-h-[470px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: "url('/cug-campus.jpg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-cug-green/15" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-cug-green-dark/55 via-cug-green/30 to-cug-green-deep/40" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-5xl mx-auto rounded-2xl border border-white/25 bg-cug-green-dark/20 p-5 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="space-y-4 sm:space-y-5 sm:text-center">
              <div className="inline-flex items-center gap-2 text-cug-gold text-label-sm font-bold uppercase tracking-wider sm:justify-center">
                <span className="h-px w-6 bg-cug-gold" />
                <span>Office of the Registrar</span>
              </div>
              <h1 className="max-w-4xl sm:mx-auto text-[32px] leading-[1.08] sm:text-display-lg font-serif font-bold text-white tracking-tight">
                Order your academic documents without queuing at the office.
              </h1>
              <p className="max-w-2xl sm:mx-auto text-body-md sm:text-body-lg text-white/90 leading-relaxed">
                Choose the documents you need and prepare a request draft. The Finance Office verifies your payment before documents are processed and sealed.
              </p>
              <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-3 pt-1 sm:justify-center">
                <button
                  type="button"
                  onClick={onStartRequest}
                  className="w-full min-[420px]:w-auto px-6 py-3 rounded-lg bg-cug-gold text-cug-green-deep hover:bg-cug-gold-hover active:scale-[0.98] font-title-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Start a request draft</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => onTrackOrder()}
                  className="w-full min-[420px]:w-auto px-6 py-3 rounded-lg border border-white/70 bg-white/10 text-white font-title-sm font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">timeline</span>
                  <span>Track a request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE CATALOGUE CARDS — Set by Finance Office */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-label-sm font-label-sm text-secondary uppercase font-bold tracking-wider">
            Official Registry Tariff Schedule
          </span>
          <h2 className="text-headline-sm sm:text-headline-md font-serif font-bold text-primary">
            Academic Services &amp; Fees
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Official tariffs approved by the CUG Directorate of Finance. All documents are prepared according to approved university standards with embossed registry seals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesCatalogue.map((item) => (
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
                title: 'Request & Transfer',
                desc: 'Fill student info, choose document quantities, and transfer fee using your Index Number as reference.'
              },
              {
                step: '02',
                title: 'Finance Clearance',
                desc: 'The CUG Finance Office reconciles statement credits against requested document tariffs.'
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
