import React, { useRef, useState } from 'react';
import type { OrderDraft, DeliveryMethod } from '../../types';
import { formatPesewas } from '../../lib/currency';
import { PICKUP_LOCATION_DEFAULT, PAYMENT_SETTINGS } from '../../lib/constants';

interface OrderSummaryStepProps {
  draft: OrderDraft;
  onEditApplicant: () => void;
  onEditServices: () => void;
}

type PaymentChannel = 'momo' | 'bank';

// Simulate generating a reference number (in production this comes from the server)
function generateRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CUG-REQ-${year}-${rand}`;
}

export const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({
  draft,
  onEditApplicant,
  onEditServices,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('momo');
  const [selectedMomoIdx, setSelectedMomoIdx] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const momoDetails = PAYMENT_SETTINGS.mobileMoney[selectedMomoIdx];
  const bankDetails = PAYMENT_SETTINGS.bankTransfer;

  const getDeliveryLabel = (method: DeliveryMethod) => {
    switch (method) {
      case 'SELF_PICKUP':
        return 'Self-Pickup (Fiapre Campus)';
      case 'PROXY_PICKUP':
        return `Authorized Proxy: ${draft.delivery.proxyName || 'Designated Representative'}`;
      case 'EMAIL':
        return `Electronic PDF to: ${draft.delivery.recipientEmail || draft.applicant.email}`;
      case 'DOMESTIC_COURIER':
        return `Ghana Post EMS Domestic Courier (${draft.delivery.city || 'Ghana'})`;
      case 'INTERNATIONAL_COURIER':
        return `DHL Express International (${draft.delivery.destinationCountry || 'International'})`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProofFile(file);
    setSubmitError('');
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setProofPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        // PDF or other
        setProofPreview(null);
      }
    } else {
      setProofPreview(null);
    }
  };

  const handleSubmit = () => {
    if (!proofFile) {
      setSubmitError('Please upload a payment proof (screenshot, photo, or PDF receipt) before submitting.');
      return;
    }
    // In production: POST to /api/orders with FormData including proof file
    const ref = generateRef();
    setReferenceNumber(ref);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 pb-24 text-center">
        <div className="bg-surface-container-lowest border border-cug-green/30 rounded-2xl p-8 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-full bg-cug-green/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-cug-green text-4xl">check_circle</span>
          </div>
          <div>
            <h2 className="text-headline-sm font-serif font-bold text-cug-green">Request Submitted!</h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              Your payment proof has been received. The Finance Office will verify your transfer and activate your request.
            </p>
          </div>

          <div className="bg-cug-green/5 border border-cug-green/20 rounded-xl p-5 text-left space-y-3">
            <p className="text-label-sm font-bold text-cug-green uppercase tracking-wider">Your Request Reference</p>
            <p className="font-mono text-2xl font-bold text-primary tracking-widest">{referenceNumber}</p>
            <p className="text-body-sm text-on-surface-variant">
              Save this reference number. Use it to track your order status on the <strong>Track Order</strong> page.
              You will be notified via <strong>{draft.applicant.email}</strong> and <strong>{draft.applicant.phone}</strong> once payment is confirmed.
            </p>
          </div>

          <div className="text-body-sm text-on-surface-variant space-y-1 text-left border-t border-outline-variant/40 pt-4">
            <p><span className="font-semibold">Applicant:</span> {draft.applicant.legalName}</p>
            <p><span className="font-semibold">Index Number:</span> {draft.applicant.indexNumber}</p>
            <p><span className="font-semibold">Amount Paid:</span> {formatPesewas(draft.totalPesewas)}</p>
            <p><span className="font-semibold">Payment Channel:</span> {selectedChannel === 'momo' ? `${momoDetails.network} (Mobile Money)` : `Bank Transfer – ${bankDetails.bankName}`}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-body-sm text-amber-900 flex items-start gap-2 text-left">
            <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5">info</span>
            <span>Processing begins only after the Finance Office confirms your payment. This typically takes <strong>1–2 business days</strong>.</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN FORM ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">

      {/* Header */}
      <section className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Final Order Verification</span>
        </div>
        <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          Step 3: Review &amp; Submit Payment
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Confirm your order, transfer the exact amount using one of the options below, then upload your payment proof to submit.
        </p>
      </section>

      {/* CARD 1: APPLICANT & DELIVERY */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <h2 className="text-title-md text-primary font-bold">Applicant &amp; Destination</h2>
          </div>
          <button type="button" onClick={onEditApplicant}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-label-sm text-primary hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-body-sm">
          <div>
            <span className="text-label-sm text-outline block">Full Name &amp; Index</span>
            <div className="font-bold text-tertiary text-body-md">{draft.applicant.legalName}</div>
            <div className="font-mono text-on-surface-variant text-label-md">
              {draft.applicant.indexNumber} • {draft.applicant.programme}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-outline-variant/60">
            <div>
              <span className="text-label-sm text-outline block">Student Status</span>
              <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {draft.applicant.status === 'COMPLETED'
                  ? `Alumnus (${draft.applicant.graduationYear || 'Completed'})`
                  : 'Continuing Student'}
              </span>
            </div>
            <div>
              <span className="text-label-sm text-outline block">Primary Contact</span>
              <span className="font-mono font-medium text-on-surface">{draft.applicant.phone}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-outline-variant/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">local_shipping</span>
            <div>
              <span className="text-label-sm text-outline block">Delivery Method</span>
              <p className="font-medium text-tertiary">{getDeliveryLabel(draft.delivery.method)}</p>
              {draft.delivery.method === 'SELF_PICKUP' && (
                <p className="text-label-sm text-outline">{PICKUP_LOCATION_DEFAULT}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: PRICE BREAKDOWN */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
            <h2 className="text-title-md text-primary font-bold">Itemized Price Breakdown</h2>
          </div>
          <button type="button" onClick={onEditServices}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-label-sm text-primary hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-3 text-body-sm">
          {draft.items.map((item) => (
            <div key={item.serviceId} className="flex items-start justify-between py-1 border-b border-surface-container">
              <div>
                <p className="font-semibold text-tertiary">{item.title}</p>
                <div className="text-label-sm text-outline flex items-center gap-2 flex-wrap">
                  <span>{item.quantity} {item.quantity === 1 ? 'copy' : 'copies'} × {formatPesewas(item.unitPricePesewas)}</span>
                  {item.options?.academicLevel && <span>• {item.options.academicLevel}</span>}
                  {item.options?.declaredPurpose && <span>• {item.options.declaredPurpose}</span>}
                </div>
              </div>
              <span className="font-mono font-bold text-tertiary">{formatPesewas(item.subtotalPesewas)}</span>
            </div>
          ))}

          <div className="flex justify-between pt-1 text-label-md text-on-surface-variant">
            <span>Documents Subtotal</span>
            <span className="font-mono font-semibold">{formatPesewas(draft.subtotalPesewas)}</span>
          </div>
          <div className="flex justify-between text-label-md text-on-surface-variant">
            <span>Delivery Fee</span>
            <span className="font-mono font-semibold">
              {draft.deliveryFeePesewas === 0 ? 'FREE (GHS 0.00)' : formatPesewas(draft.deliveryFeePesewas)}
            </span>
          </div>

          <div className="pt-3 border-t-2 border-primary/20 flex items-center justify-between">
            <div>
              <span className="text-title-md text-primary font-bold block">Total Payable Amount</span>
              <span className="text-label-sm text-outline font-mono">Official Currency: Ghana Cedis (GHS)</span>
            </div>
            <div className="text-right">
              <span className="text-headline-sm font-bold text-primary font-mono block">{formatPesewas(draft.totalPesewas)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 3: PAYMENT METHOD SELECTION */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-5">
        <div className="border-b border-outline-variant/50 pb-2.5">
          <h2 className="text-title-md text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">payments</span>
            Payment Instructions
          </h2>
          <p className="text-body-sm text-outline mt-0.5">
            Transfer the exact amount using one of the options below, then upload your proof.
          </p>
        </div>

        {/* Channel Tabs */}
        <div className="grid grid-cols-2 gap-3">
          {(['momo', 'bank'] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setSelectedChannel(ch)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedChannel === ch
                  ? 'border-cug-green bg-cug-green/5 ring-1 ring-cug-green'
                  : 'border-outline-variant hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-xl ${selectedChannel === ch ? 'text-cug-green' : 'text-outline'}`}>
                  {ch === 'momo' ? 'smartphone' : 'account_balance'}
                </span>
                <span className="text-title-sm font-semibold text-on-surface">
                  {ch === 'momo' ? 'Mobile Money' : 'Bank Transfer'}
                </span>
              </div>
              <p className="text-body-sm text-outline pl-7">
                {ch === 'momo' ? 'MTN MoMo, Telecel Cash' : 'GCB, direct deposit'}
              </p>
            </button>
          ))}
        </div>

        {/* ── MOBILE MONEY DETAILS ── */}
        {selectedChannel === 'momo' && (
          <div className="space-y-4 animate-fade-in">
            {/* Network selector */}
            <div className="flex gap-2 flex-wrap">
              {PAYMENT_SETTINGS.mobileMoney.map((net, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedMomoIdx(idx)}
                  className={`px-4 py-1.5 rounded-full text-label-md font-semibold border transition-all ${
                    selectedMomoIdx === idx
                      ? 'bg-cug-green text-white border-cug-green shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {net.network}
                </button>
              ))}
            </div>

            {/* Account card */}
            <div className="bg-cug-green/5 border border-cug-green/25 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cug-green font-bold text-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">smartphone</span>
                {momoDetails.network} — Finance Office Account
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-cug-green/20">
                  <span className="text-label-sm text-outline block mb-0.5">Mobile Number</span>
                  <span className="font-mono font-bold text-xl text-primary tracking-widest">{momoDetails.accountNumber}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cug-green/20">
                  <span className="text-label-sm text-outline block mb-0.5">Account Name</span>
                  <span className="font-semibold text-on-surface text-body-sm leading-snug">{momoDetails.accountName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-body-sm text-amber-900">
                <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 shrink-0">info</span>
                <span>{momoDetails.instructions}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-cug-green/8 rounded-lg">
                <span className="material-symbols-outlined text-cug-green text-base">payments</span>
                <span className="text-body-sm font-bold text-cug-green">
                  Amount to send: <span className="font-mono text-lg">{formatPesewas(draft.totalPesewas)}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── BANK TRANSFER DETAILS ── */}
        {selectedChannel === 'bank' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-cug-green/5 border border-cug-green/25 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cug-green font-bold text-label-sm uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">account_balance</span>
                {bankDetails.bankName} — University Account
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Account Name', value: bankDetails.accountName },
                  { label: 'Account Number', value: bankDetails.accountNumber },
                  { label: 'Bank', value: bankDetails.bankName },
                  { label: 'Branch', value: bankDetails.branch },
                  { label: 'Sort Code', value: bankDetails.sortCode },
                  { label: 'SWIFT / BIC', value: bankDetails.swiftCode },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-lg p-3 border border-cug-green/20">
                    <span className="text-label-sm text-outline block mb-0.5">{label}</span>
                    <span className="font-mono font-bold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 text-body-sm text-amber-900">
                <span className="material-symbols-outlined text-amber-600 text-[18px] mt-0.5 shrink-0">info</span>
                <span>{bankDetails.instructions}</span>
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-cug-green/8 rounded-lg">
                <span className="material-symbols-outlined text-cug-green text-base">payments</span>
                <span className="text-body-sm font-bold text-cug-green">
                  Amount to deposit: <span className="font-mono text-lg">{formatPesewas(draft.totalPesewas)}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CARD 4: PROOF OF PAYMENT UPLOAD */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-outline-variant/50 pb-2.5">
          <h2 className="text-title-md text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">upload_file</span>
            Upload Payment Proof
          </h2>
          <p className="text-body-sm text-outline mt-0.5">
            Required — a screenshot, photo, or PDF of your transfer confirmation.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            proofFile
              ? 'border-cug-green bg-cug-green/5'
              : submitError
              ? 'border-error bg-error/5'
              : 'border-outline-variant hover:border-cug-green/50 hover:bg-surface-container-low'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {proofFile ? (
            <div className="space-y-3">
              {proofPreview ? (
                <img
                  src={proofPreview}
                  alt="Payment proof preview"
                  className="max-h-48 mx-auto rounded-lg border border-cug-green/20 shadow-sm object-contain"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-cug-green/10 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-cug-green text-3xl">picture_as_pdf</span>
                </div>
              )}
              <p className="text-body-sm font-semibold text-cug-green">{proofFile.name}</p>
              <p className="text-label-sm text-outline">
                {(proofFile.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-outline text-3xl">add_photo_alternate</span>
              </div>
              <p className="text-body-md font-semibold text-on-surface">
                Tap to upload your payment screenshot or receipt
              </p>
              <p className="text-body-sm text-outline">JPG, PNG, or PDF · Max 5 MB</p>
            </div>
          )}
        </div>

        {submitError && (
          <p role="alert" className="flex items-center gap-2 text-body-sm text-error">
            <span className="material-symbols-outlined text-base">error</span>
            {submitError}
          </p>
        )}

        <div className="flex items-start gap-2 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-secondary text-base mt-0.5">lock</span>
          <span>
            Your proof is transmitted securely to the Finance Office. Personal payment data is not stored on public servers.
          </span>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onEditServices}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-label-md font-medium"
        >
          ← Back to Services
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-cug-green text-white hover:bg-cug-green-light active:scale-[0.98] focus:ring-2 focus:ring-cug-green/50 font-title-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">send</span>
          <span>Submit Request &amp; Get Reference</span>
        </button>
      </div>
    </div>
  );
};
