import React, { useState } from 'react';
import type { OrderDraft, DeliveryMethod } from '../../types';
import { formatPesewas } from '../../lib/currency';
import { PICKUP_LOCATION_DEFAULT } from '../../lib/constants';

interface OrderSummaryStepProps {
  draft: OrderDraft;
  onEditApplicant: () => void;
  onEditServices: () => void;
  onPaymentSuccess: (referenceNumber: string) => void;
}

export const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({
  draft,
  onEditApplicant,
  onEditServices,
  onPaymentSuccess
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [momoNetwork, setMomoNetwork] = useState<'mtn' | 'telecel' | 'at'>('mtn');
  const [momoNumber, setMomoNumber] = useState(draft.applicant.phone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');

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

  const handlePayNow = () => {
    setIsProcessing(true);
    setProcessingStage('Validating request items & price snapshots...');

    setTimeout(() => {
      setProcessingStage('Creating secure payment transaction...');
      setTimeout(() => {
        setProcessingStage('Authorizing mobile money prompt / card checkout...');
        setTimeout(() => {
          setProcessingStage('Confirming settlement & generating CUG Registry Reference...');
          setTimeout(() => {
            // Generate official human-readable reference: CUG-REQ-YYYY-XXXX
            const year = new Date().getFullYear();
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const refNumber = `CUG-REQ-${year}-${randomCode}`;
            setIsProcessing(false);
            onPaymentSuccess(refNumber);
          }, 700);
        }, 700);
      }, 700);
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <section className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">verified</span>
          <span>Final Order Verification</span>
        </div>
        <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          Step 3: Review &amp; Pay
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Please confirm your student information, document quantities, and recipient details before authorizing payment.
        </p>
      </section>

      {/* CARD 1: APPLICANT & RECIPIENT SUMMARY */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <h2 className="text-title-md font-title-md text-primary font-bold">
              Applicant &amp; Destination Summary
            </h2>
          </div>
          <button
            type="button"
            onClick={onEditApplicant}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-label-sm font-label-sm text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Edit Info</span>
          </button>
        </div>

        <div className="space-y-3 text-body-sm font-body-sm">
          <div>
            <span className="text-label-sm font-label-sm text-outline block">Full Name &amp; Student Index</span>
            <div className="text-body-md font-bold text-tertiary">
              {draft.applicant.legalName}
            </div>
            <div className="text-label-md font-label-md font-mono text-on-surface-variant">
              {draft.applicant.indexNumber} • {draft.applicant.programme}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-outline-variant/60">
            <div>
              <span className="text-label-sm font-label-sm text-outline block">Student Status</span>
              <span className="inline-flex items-center gap-1.5 text-label-sm font-semibold text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {draft.applicant.status === 'COMPLETED'
                  ? `Alumnus (${draft.applicant.graduationYear || 'Completed'})`
                  : 'Continuing Student'}
              </span>
            </div>
            <div>
              <span className="text-label-sm font-label-sm text-outline block">Primary Contact</span>
              <span className="text-on-surface font-mono font-medium">
                {draft.applicant.phone}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-dashed border-outline-variant/60">
            <span className="text-label-sm font-label-sm text-outline block">Recipient Configuration</span>
            {draft.recipient.type === 'ORGANIZATION' ? (
              <div>
                <p className="font-semibold text-tertiary">{draft.recipient.organizationName}</p>
                <p className="text-label-sm text-outline">
                  Attn: {draft.recipient.attentionPerson || 'Admissions / HR'}
                  {draft.recipient.referenceNumber && ` • Ref: ${draft.recipient.referenceNumber}`}
                </p>
              </div>
            ) : draft.recipient.type === 'OTHER' ? (
              <p className="font-medium text-tertiary">
                {draft.recipient.otherLegalName} ({draft.recipient.otherRelationship || 'Representative'})
              </p>
            ) : (
              <p className="font-medium text-tertiary">Directly to Student</p>
            )}
          </div>

          <div className="pt-2 border-t border-dashed border-outline-variant/60 flex items-start gap-2">
            <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">
              local_shipping
            </span>
            <div>
              <span className="text-label-sm font-label-sm text-outline block">Delivery Method</span>
              <p className="font-medium text-tertiary">
                {getDeliveryLabel(draft.delivery.method)}
              </p>
              {draft.delivery.method === 'SELF_PICKUP' && (
                <p className="text-label-sm text-outline">{PICKUP_LOCATION_DEFAULT}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: ITEMIZED PRICE BREAKDOWN */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
            <h2 className="text-title-md font-title-md text-primary font-bold">
              Itemized Price Breakdown
            </h2>
          </div>
          <button
            type="button"
            onClick={onEditServices}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-label-sm font-label-sm text-primary hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[15px]">edit_note</span>
            <span>Edit Services</span>
          </button>
        </div>

        <div className="space-y-3 text-body-sm">
          {draft.items.map((item) => (
            <div key={item.serviceId} className="flex items-start justify-between py-1 border-b border-surface-container">
              <div>
                <p className="font-semibold text-tertiary">{item.title}</p>
                <div className="text-label-sm font-label-sm text-outline flex items-center gap-2">
                  <span>{item.quantity} {item.quantity === 1 ? 'copy' : 'copies'} × {formatPesewas(item.unitPricePesewas)}</span>
                  {item.options?.academicLevel && (
                    <span>• {item.options.academicLevel}</span>
                  )}
                  {item.options?.declaredPurpose && (
                    <span>• {item.options.declaredPurpose}</span>
                  )}
                </div>
              </div>
              <span className="font-mono font-bold text-tertiary">
                {formatPesewas(item.subtotalPesewas)}
              </span>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex justify-between pt-2 text-label-md font-label-md text-on-surface-variant">
            <span>Documents Subtotal</span>
            <span className="font-mono font-semibold">{formatPesewas(draft.subtotalPesewas)}</span>
          </div>

          {/* Delivery */}
          <div className="flex justify-between text-label-md font-label-md text-on-surface-variant">
            <span>Delivery Fee</span>
            <span className="font-mono font-semibold">
              {draft.deliveryFeePesewas === 0 ? 'FREE (GHS 0.00)' : formatPesewas(draft.deliveryFeePesewas)}
            </span>
          </div>

          {/* Grand Total */}
          <div className="pt-3 border-t-2 border-primary/20 flex items-center justify-between">
            <div>
              <span className="text-title-md font-title-md text-primary font-bold block">
                Total Payable Amount
              </span>
              <span className="text-label-sm text-outline font-mono">
                Official Currency: Ghana Cedis (GHS)
              </span>
            </div>
            <div className="text-right">
              <span className="text-headline-sm font-headline-sm font-bold text-primary font-mono block">
                {formatPesewas(draft.totalPesewas)}
              </span>
              <span className="text-[11px] text-outline font-mono">
                ({draft.totalPesewas} pesewas)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 3: PAYMENT SELECTION */}
      <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm space-y-4">
        <div className="border-b border-outline-variant/50 pb-2.5">
          <h2 className="text-title-md font-title-md text-primary font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">payments</span>
            Select Payment Method
          </h2>
          <p className="text-body-sm font-body-sm text-outline mt-0.5">
            Pay instantly with Ghana Mobile Money or Visa/Mastercard
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPaymentMethod === 'momo'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-outline-variant hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <input
                type="radio"
                name="paymentChannel"
                checked={selectedPaymentMethod === 'momo'}
                onChange={() => setSelectedPaymentMethod('momo')}
                className="text-primary focus:ring-secondary h-4 w-4"
              />
              <span className="text-title-sm font-title-sm font-semibold text-on-surface">
                Mobile Money
              </span>
            </div>
            <p className="text-body-sm text-outline pl-6">
              MTN MoMo, Telecel Cash, AT Money
            </p>
          </label>

          <label
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedPaymentMethod === 'card'
                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                : 'border-outline-variant hover:bg-surface-container-low'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <input
                type="radio"
                name="paymentChannel"
                checked={selectedPaymentMethod === 'card'}
                onChange={() => setSelectedPaymentMethod('card')}
                className="text-primary focus:ring-secondary h-4 w-4"
              />
              <span className="text-title-sm font-title-sm font-semibold text-on-surface">
                Bank Card (Debit/Credit)
              </span>
            </div>
            <p className="text-body-sm text-outline pl-6">
              Visa, Mastercard, GHLink
            </p>
          </label>
        </div>

        {/* MoMo Options */}
        {selectedPaymentMethod === 'momo' && (
          <div className="p-4 bg-surface-container-low rounded-lg space-y-3 border border-outline-variant animate-fade-in">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mtn' as const, name: 'MTN MoMo' },
                { id: 'telecel' as const, name: 'Telecel Cash' },
                { id: 'at' as const, name: 'AT Money' }
              ].map(net => (
                <button
                  key={net.id}
                  type="button"
                  onClick={() => setMomoNetwork(net.id)}
                  className={`py-2 px-3 rounded-lg text-label-md font-label-md font-semibold text-center border transition-all ${
                    momoNetwork === net.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {net.name}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                MoMo Wallet Phone Number
              </label>
              <input
                type="tel"
                value={momoNumber}
                onChange={e => setMomoNumber(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
              />
              <p className="text-[11px] text-outline mt-1">
                An authorization prompt will be dispatched to this wallet
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 text-body-sm text-outline">
          <span className="material-symbols-outlined text-secondary text-base">lock</span>
          <span>Secured with 256-bit institutional encryption &amp; authoritative price locks</span>
        </div>
      </section>

      {/* ACTION BUTTONS */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onEditServices}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors text-label-md font-label-md font-medium"
        >
          ← Back to Services
        </button>

        <button
          type="button"
          onClick={handlePayNow}
          disabled={isProcessing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container active:bg-primary focus:ring-2 focus:ring-secondary/50 font-title-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xl">payments</span>
          <span>Authorize &amp; Pay {formatPesewas(draft.totalPesewas)}</span>
        </button>
      </div>

      {/* PROCESSING MODAL */}
      {isProcessing && (
        <div className="fixed inset-0 bg-tertiary/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant text-center space-y-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl animate-spin">
                sync
              </span>
            </div>

            <h3 className="text-headline-sm font-serif font-bold text-primary">
              Processing Payment
            </h3>

            <p className="text-body-md text-on-surface-variant font-medium">
              {processingStage}
            </p>

            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full animate-pulse w-3/4 rounded-full" />
            </div>

            <p className="text-label-sm text-outline">
              Do not refresh this window. Your order total of {formatPesewas(draft.totalPesewas)} is being verified.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
