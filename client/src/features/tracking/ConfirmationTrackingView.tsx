import React, { useState } from 'react';
import type { OrderDraft } from '../../types';
import { formatPesewas } from '../../lib/currency';
import { PICKUP_LOCATION_DEFAULT } from '../../lib/constants';

interface ConfirmationTrackingViewProps {
  referenceNumber: string;
  orderDraft: OrderDraft;
  onNewRequest: () => void;
}

export const ConfirmationTrackingView: React.FC<ConfirmationTrackingViewProps> = ({
  referenceNumber,
  orderDraft,
  onNewRequest
}) => {
  const [activeTab, setActiveTab] = useState<'confirmation' | 'tracking'>('confirmation');
  const [copied, setCopied] = useState(false);

  // Tracking query inputs
  const [searchRef, setSearchRef] = useState(referenceNumber);
  const [searchIdentifier, setSearchIdentifier] = useState(orderDraft.applicant.indexNumber);
  const [hasQueried, setHasQueried] = useState(true);

  const handleCopyReference = () => {
    navigator.clipboard.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timelineSteps = [
    {
      title: 'Payment Confirmed & Settled',
      date: 'Today, Just now',
      desc: 'Mobile Money transaction settled. Request docket generated in Registry queue.',
      status: 'completed' as const
    },
    {
      title: 'Finance Office Fee Clearance',
      date: 'Pending Review',
      desc: 'Checking student financial record and institutional clearance in CUG records.',
      status: 'current' as const
    },
    {
      title: 'Records Office Document Preparation',
      date: 'Queued',
      desc: 'Academic records search, transcript drafting, and verification against archives.',
      status: 'upcoming' as const
    },
    {
      title: 'Academic Registrar Approval & Institutional Seal',
      date: 'Queued',
      desc: 'Official cryptographic sealing and authorized Registrar signature.',
      status: 'upcoming' as const
    },
    {
      title: orderDraft.delivery.method === 'SELF_PICKUP' || orderDraft.delivery.method === 'PROXY_PICKUP'
        ? 'Ready for Collection at Fiapre Desk'
        : orderDraft.delivery.method === 'EMAIL'
        ? 'Digital Dispatch to Recipient Email'
        : 'Dispatched via Courier Service',
      date: 'Estimated 2-3 business days',
      desc: orderDraft.delivery.method === 'SELF_PICKUP'
        ? PICKUP_LOCATION_DEFAULT
        : orderDraft.delivery.method === 'EMAIL'
        ? `Direct PDF transmission to ${orderDraft.delivery.recipientEmail || orderDraft.applicant.email}`
        : 'Waybill tracking number will be sent via SMS upon courier dispatch.',
      status: 'upcoming' as const
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24">
      {/* View Switcher Tabs */}
      <section className="bg-surface-container-low p-1.5 rounded-xl flex items-center shadow-xs border border-outline-variant/50">
        <button
          type="button"
          onClick={() => setActiveTab('confirmation')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-title-sm font-title-sm flex items-center justify-center gap-2 transition-all font-semibold ${
            activeTab === 'confirmation'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Order Confirmation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracking')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-title-sm font-title-sm flex items-center justify-center gap-2 transition-all font-semibold ${
            activeTab === 'tracking'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-lg">timeline</span>
          <span>Live Tracking</span>
          <span className="w-2 h-2 rounded-full bg-secondary" />
        </button>
      </section>

      {/* VIEW 1: ORDER CONFIRMATION */}
      {activeTab === 'confirmation' && (
        <div className="space-y-6 animate-fade-in">
          {/* Primary Success Card */}
          <article className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/80 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl font-bold">verified</span>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-label-sm font-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Payment Confirmed &amp; Settled
                </div>
                <h1 className="text-headline-sm sm:text-headline-md font-serif font-bold text-primary leading-tight">
                  Your Academic Service Request Has Been Submitted
                </h1>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Your request docket has been generated and routed to the Academic Affairs Registry Desk, Fiapre Campus.
                </p>
              </div>
            </div>

            {/* Reference Identifier Box */}
            <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-label-sm font-label-sm text-outline uppercase tracking-wider block font-semibold">
                  Official Tracking Reference
                </span>
                <span className="font-mono text-headline-sm font-bold text-primary tracking-wide">
                  {referenceNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyReference}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-surface-container-lowest text-primary border border-outline-variant rounded-lg text-label-md font-label-md font-semibold hover:bg-surface-container transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy Reference'}</span>
              </button>
            </div>
          </article>

          {/* Docket Summary Details */}
          <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-title-md font-title-md text-primary font-bold border-b border-outline-variant/50 pb-2">
              Request Docket Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
              <div>
                <span className="text-label-sm text-outline block">Applicant Name</span>
                <span className="font-semibold text-tertiary">{orderDraft.applicant.legalName}</span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">Student Index Number</span>
                <span className="font-mono font-semibold text-tertiary">{orderDraft.applicant.indexNumber}</span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">Programme</span>
                <span className="text-tertiary">{orderDraft.applicant.programme}</span>
              </div>
              <div>
                <span className="text-label-sm text-outline block">Total Amount Paid</span>
                <span className="font-mono font-bold text-primary">{formatPesewas(orderDraft.totalPesewas)}</span>
              </div>
            </div>

            {/* Requested Items Table */}
            <div className="pt-3 border-t border-outline-variant/50">
              <span className="text-label-sm text-outline uppercase tracking-wider font-semibold block mb-2">
                Requested Documents ({orderDraft.items.length})
              </span>
              <div className="divide-y divide-surface-container">
                {orderDraft.items.map((item) => (
                  <div key={item.serviceId} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-tertiary">{item.title}</p>
                      <p className="text-label-sm text-outline">
                        {item.quantity} {item.quantity === 1 ? 'copy' : 'copies'}
                        {item.options?.academicLevel && ` • ${item.options.academicLevel}`}
                        {item.options?.declaredPurpose && ` • ${item.options.declaredPurpose}`}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-tertiary">
                      {formatPesewas(item.subtotalPesewas)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Instructions */}
            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 flex items-start gap-3">
              <span className="material-symbols-outlined text-secondary text-xl mt-0.5">
                info
              </span>
              <div className="text-body-sm">
                <span className="font-bold text-primary block">Collection &amp; Dispatch Instructions</span>
                {orderDraft.delivery.method === 'SELF_PICKUP' ? (
                  <p className="text-on-surface-variant mt-0.5">
                    Your documents will be prepared for collection at {PICKUP_LOCATION_DEFAULT}. Please present your student ID or this reference code upon pickup.
                  </p>
                ) : orderDraft.delivery.method === 'PROXY_PICKUP' ? (
                  <p className="text-on-surface-variant mt-0.5">
                    Authorized proxy ({orderDraft.delivery.proxyName}) may collect at Room 104 Fiapre Campus with a valid ID and this reference code.
                  </p>
                ) : orderDraft.delivery.method === 'EMAIL' ? (
                  <p className="text-on-surface-variant mt-0.5">
                    Certified digital PDF documents will be emailed to {orderDraft.delivery.recipientEmail || orderDraft.applicant.email} once approved by the Registrar.
                  </p>
                ) : (
                  <p className="text-on-surface-variant mt-0.5">
                    Documents will be sealed in an official registry envelope and dispatched via {orderDraft.delivery.method === 'DOMESTIC_COURIER' ? 'Ghana Post EMS' : 'DHL Express'}. Tracking number will be issued.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-on-primary font-semibold text-title-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-lg">timeline</span>
              <span>View Live Tracking</span>
            </button>

            <button
              type="button"
              onClick={onNewRequest}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low font-medium text-label-md transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE TRACKING */}
      {activeTab === 'tracking' && (
        <div className="space-y-6 animate-fade-in">
          {/* Tracking Search Card */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/70 shadow-sm space-y-4">
            <h2 className="text-title-md font-title-md text-primary font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">search</span>
              Registry Status Verification (2-Factor)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={searchRef}
                  onChange={e => setSearchRef(e.target.value)}
                  placeholder="e.g. CUG-REQ-2026-8941"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                  Student Index OR Phone
                </label>
                <input
                  type="text"
                  value={searchIdentifier}
                  onChange={e => setSearchIdentifier(e.target.value)}
                  placeholder="Index or registered phone"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setHasQueried(true)}
                className="px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">track_changes</span>
                <span>Lookup Status</span>
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          {hasQueried && (
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/70 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/50 gap-2">
                <div>
                  <span className="text-label-sm text-outline block font-mono">DOCKET: {searchRef}</span>
                  <h3 className="text-title-lg font-serif font-bold text-primary">
                    Processing Stage: Under Review
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  In Progress
                </span>
              </div>

              {/* Stepper Timeline List */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/60">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Bullet */}
                    <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                      step.status === 'completed'
                        ? 'bg-primary text-white shadow-xs'
                        : step.status === 'current'
                        ? 'bg-secondary text-white ring-4 ring-secondary/20'
                        : 'bg-surface-container border border-outline-variant text-outline'
                    }`}>
                      {step.status === 'completed' ? (
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      ) : step.status === 'current' ? (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      ) : (
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-title-sm font-semibold ${
                          step.status === 'completed' || step.status === 'current'
                            ? 'text-primary'
                            : 'text-on-surface-variant'
                        }`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-outline font-mono">
                          {step.date}
                        </span>
                      </div>
                      <p className="text-body-sm text-outline">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Independent Item Status Summary */}
              <div className="pt-4 border-t border-outline-variant/50">
                <h4 className="text-title-sm font-bold text-primary mb-3">
                  Service Item Breakdown
                </h4>
                <div className="space-y-2">
                  {orderDraft.items.map((item, i) => (
                    <div key={item.serviceId} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                      <div>
                        <span className="font-semibold text-tertiary text-body-sm block">
                          {item.title} ({item.quantity} {item.quantity === 1 ? 'copy' : 'copies'})
                        </span>
                        <span className="text-label-sm text-outline">
                          Registry Queue: Academic Affairs Archive
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {i === 0 ? 'In Preparation' : 'Pending Clearance'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 bg-surface-container-low rounded-lg text-body-sm text-outline flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">shield</span>
                <span>Protected under CUG Data Privacy rules. Sensitive grades, drafts, and staff notes are strictly hidden from public tracking.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
