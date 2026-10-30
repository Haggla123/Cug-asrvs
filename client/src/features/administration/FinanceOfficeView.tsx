import React, { useState } from 'react';
import { PAYMENT_SETTINGS } from '../../lib/constants';

// ---------------------------------------------------------------------------
// FINANCE OFFICE PORTAL
// Allows Finance Office staff to:
//   1. View what documents/services the student requested with quantities
//   2. See the exact itemized breakdown and total the student is to send
//   3. Compare the total expected against the amount received in the bank/MoMo statement
//   4. Inspect uploaded payment screenshots/receipts
//   5. Approve (clearing for records processing) or Reject with specific reason
//   6. Manage university MoMo and Bank account details displayed during checkout
// ---------------------------------------------------------------------------

type ProofStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RequestedDocumentItem {
  title: string;
  quantity: number;
  unitPriceGHS: string;
  subtotalGHS: string;
  details?: string;
}

export interface PaymentSubmission {
  id: string;
  referenceNumber: string;
  applicantName: string;
  indexNumber: string;
  programme: string;
  phone: string;
  email: string;
  channel: 'Mobile Money' | 'Bank Transfer';
  channelDetails: string; // e.g. "MTN MoMo (0244123456)" or "GCB Bank Deposit"
  submittedAt: string;
  status: ProofStatus;
  proofType: 'image' | 'pdf';
  proofUrl?: string;
  
  // What the student is requesting:
  items: RequestedDocumentItem[];
  deliveryMethod: string;
  deliveryFeeGHS: string;
  documentsSubtotalGHS: string;
  totalExpectedGHS: string; // The exact total the person is to send
  
  // Reconciliation:
  amountReceivedGHS?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// Demo seed data reflecting realistic multi-service academic requests
const DEMO_SUBMISSIONS: PaymentSubmission[] = [
  {
    id: 'sub_001',
    referenceNumber: 'CUG-REQ-2026-4821',
    applicantName: 'Akosua Mensah',
    indexNumber: 'CUG/2021/0034',
    programme: 'BSc. Information Technology',
    phone: '0244123456',
    email: 'a.mensah@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'MTN MoMo • Wallet: 0244123456',
    submittedAt: '2026-10-30 09:14',
    status: 'PENDING',
    proofType: 'image',
    proofUrl: '/cug-logo.png',
    items: [
      {
        title: 'Official Academic Transcript',
        quantity: 1,
        unitPriceGHS: 'GHS 50.00',
        subtotalGHS: 'GHS 50.00',
        details: "Bachelor's Degree • Official Seal Included"
      },
      {
        title: 'English Proficiency Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 40.00',
        subtotalGHS: 'GHS 40.00',
        details: 'Medium of Instruction Certification'
      }
    ],
    deliveryMethod: 'Self-Pickup (Academic Affairs Desk, Fiapre Campus)',
    deliveryFeeGHS: 'FREE (GHS 0.00)',
    documentsSubtotalGHS: 'GHS 90.00',
    totalExpectedGHS: 'GHS 90.00',
  },
  {
    id: 'sub_002',
    referenceNumber: 'CUG-REQ-2026-3317',
    applicantName: 'Kofi Asante',
    indexNumber: 'CUG/2020/0128',
    programme: 'BSc. Accounting',
    phone: '0208765432',
    email: 'k.asante@alumni.cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Transfer • Sunyani Branch',
    submittedAt: '2026-10-30 10:02',
    status: 'PENDING',
    proofType: 'pdf',
    items: [
      {
        title: 'Official Academic Transcript',
        quantity: 2,
        unitPriceGHS: 'GHS 50.00',
        subtotalGHS: 'GHS 100.00',
        details: "Bachelor's Degree • For Master's Admission Abroad"
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier (Kumasi, Ashanti Region)',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 100.00',
    totalExpectedGHS: 'GHS 150.00',
  },
  {
    id: 'sub_003',
    referenceNumber: 'CUG-REQ-2026-1195',
    applicantName: 'Ama Darko',
    indexNumber: 'CUG/2019/0577',
    programme: 'BSc. Public Health (Nursing)',
    phone: '0551239876',
    email: 'ama.darko@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'Telecel Cash • Wallet: 0551239876',
    submittedAt: '2026-10-29 16:45',
    status: 'APPROVED',
    proofType: 'image',
    amountReceivedGHS: 'GHS 125.00',
    verifiedBy: 'Mr. Emmanuel Osei (Senior Finance Officer)',
    verifiedAt: '2026-10-29 17:10',
    items: [
      {
        title: 'Attestation / Introductory Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 35.00',
        subtotalGHS: 'GHS 35.00',
        details: 'Purpose: Visa / Embassy Application'
      },
      {
        title: 'Academic Recommendation Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 40.00',
        subtotalGHS: 'GHS 40.00',
        details: 'Target: Dean, Faculty of Health & Allied Sciences'
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier (Sunyani)',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 75.00',
    totalExpectedGHS: 'GHS 125.00',
  },
  {
    id: 'sub_004',
    referenceNumber: 'CUG-REQ-2026-0882',
    applicantName: 'Yaw Boateng',
    indexNumber: 'CUG/2022/0213',
    programme: 'B.Ed. Mathematics',
    phone: '0279876543',
    email: 'y.boateng@cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Deposit',
    submittedAt: '2026-10-28 11:30',
    status: 'REJECTED',
    proofType: 'pdf',
    amountReceivedGHS: 'GHS 40.00',
    rejectionReason: 'Discrepancy: Received GHS 40.00 on bank slip instead of the required GHS 85.00 (Attestation GHS 35.00 + Courier GHS 50.00). Student contacted to pay remaining GHS 45.00.',
    verifiedBy: 'Mrs. Janet Antwi (Finance Officer)',
    verifiedAt: '2026-10-28 12:15',
    items: [
      {
        title: 'Attestation / Introductory Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 35.00',
        subtotalGHS: 'GHS 35.00',
        details: 'Purpose: Banking & Financial Account'
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier (Accra)',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 35.00',
    totalExpectedGHS: 'GHS 85.00',
  },
];

type FinanceTab = 'proofs' | 'settings';

const statusBadge = (status: ProofStatus) => {
  if (status === 'APPROVED')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cug-green/10 text-cug-green text-[11px] font-bold uppercase tracking-wide">
        <span className="material-symbols-outlined text-[13px]">check_circle</span>
        Payment Confirmed
      </span>
    );
  if (status === 'REJECTED')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-bold uppercase tracking-wide">
        <span className="material-symbols-outlined text-[13px]">cancel</span>
        Rejected / Discrepancy
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wide border border-amber-300">
      <span className="material-symbols-outlined text-[13px] text-amber-700">schedule</span>
      Awaiting Verification
    </span>
  );
};

export const FinanceOfficeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('proofs');
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(DEMO_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_SUBMISSIONS[0].id);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProofStatus | 'ALL'>('ALL');
  
  // Custom amount received confirmation input
  const [confirmedAmount, setConfirmedAmount] = useState<string>('');

  // Payment settings edit state
  const [editingMomo, setEditingMomo] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [momoSettings, setMomoSettings] = useState(PAYMENT_SETTINGS.mobileMoney);
  const [bankSettings, setBankSettings] = useState(PAYMENT_SETTINGS.bankTransfer);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pending = submissions.filter((s) => s.status === 'PENDING');
  const selected = submissions.find((s) => s.id === selectedId) ?? null;

  const handleSelectSubmission = (sub: PaymentSubmission) => {
    setSelectedId(sub.id);
    setConfirmedAmount(sub.amountReceivedGHS ? sub.amountReceivedGHS.replace('GHS ', '') : sub.totalExpectedGHS.replace('GHS ', ''));
    setRejectReason('');
  };

  const handleApprove = (id: string) => {
    const verifiedAmountStr = confirmedAmount ? `GHS ${parseFloat(confirmedAmount).toFixed(2)}` : (selected?.totalExpectedGHS || 'GHS 0.00');
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'APPROVED' as const,
              amountReceivedGHS: verifiedAmountStr,
              verifiedBy: 'Finance Officer (On-Duty)',
              verifiedAt: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
            }
          : s
      )
    );
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'REJECTED' as const,
              amountReceivedGHS: confirmedAmount ? `GHS ${parseFloat(confirmedAmount || '0').toFixed(2)}` : undefined,
              rejectionReason: rejectReason,
              verifiedBy: 'Finance Officer (On-Duty)',
              verifiedAt: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
            }
          : s
      )
    );
    setRejectReason('');
  };

  const handleSaveSettings = () => {
    setEditingMomo(false);
    setEditingBank(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filtered =
    filterStatus === 'ALL' ? submissions : submissions.filter((s) => s.status === filterStatus);

  return (
    <div className="space-y-6 pb-16">
      {/* Institutional Header Banner */}
      <div className="bg-cug-green-dark text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-l-8 border-cug-gold">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-cug-gold/20 border border-cug-gold/40 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-cug-gold text-3xl">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-wider uppercase text-cug-gold font-bold">
                Directorate of Finance • Fiapre-Sunyani
              </span>
            </div>
            <h1 className="text-headline-sm font-serif font-bold text-white tracking-tight">
              Finance Office Payment Verification Portal
            </h1>
            <p className="text-white/80 text-body-sm mt-0.5">
              Verify student payment proofs, reconcile bank/MoMo statement credits against requested document fees, and issue financial clearance.
            </p>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-400/20 border border-amber-300/40 rounded-xl shrink-0">
            <span className="material-symbols-outlined text-amber-300 text-xl animate-pulse">pending_actions</span>
            <div>
              <span className="text-amber-200 font-bold text-title-sm block leading-tight">
                {pending.length} Pending {pending.length === 1 ? 'Clearance' : 'Clearances'}
              </span>
              <span className="text-[11px] text-white/70">Awaiting statement confirmation</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-surface-container-low rounded-xl p-1.5 w-fit border border-outline-variant/40">
        {[
          ['proofs', 'receipt_long', 'Student Requests & Payment Clearance'],
          ['settings', 'tune', 'University Account Settings (MoMo / Bank)'],
        ].map(([tab, icon, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as FinanceTab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-label-md font-semibold transition-all ${
              activeTab === tab
                ? 'bg-cug-green text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: STUDENT REQUESTS & PAYMENT CLEARANCE                         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'proofs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (5 cols): Submissions List */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick Summary Strip */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: 'Pending', count: submissions.filter((s) => s.status === 'PENDING').length, color: 'text-amber-800 bg-amber-50 border-amber-300' },
                { label: 'Cleared', count: submissions.filter((s) => s.status === 'APPROVED').length, color: 'text-cug-green bg-cug-green/5 border-cug-green/30' },
                { label: 'Rejected', count: submissions.filter((s) => s.status === 'REJECTED').length, color: 'text-error bg-error/5 border-error/25' },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl border p-2.5 text-center shadow-2xs ${color}`}>
                  <p className="text-xl font-bold font-mono">{count}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center justify-between gap-2 pt-1 border-b border-outline-variant/40 pb-2">
              <span className="text-label-sm font-bold text-outline uppercase tracking-wider">Filter Requests:</span>
              <div className="flex gap-1.5 flex-wrap">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterStatus(f)}
                    className={`px-3 py-1 rounded-full text-label-sm font-semibold border transition-all ${
                      filterStatus === f
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Pending' : f === 'APPROVED' ? 'Cleared' : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
                  <p className="text-body-md font-medium">No requests match this filter.</p>
                </div>
              )}

              {filtered.map((sub) => {
                const isSelected = selectedId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`bg-surface-container-lowest border rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cug-green ring-2 ring-cug-green/40 shadow-md bg-cug-green/[0.02]'
                        : 'border-outline-variant/70 hover:border-cug-green/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-primary text-[13px]">
                            {sub.referenceNumber}
                          </span>
                          {statusBadge(sub.status)}
                        </div>
                        <p className="font-bold text-on-surface text-body-md mt-1 truncate">
                          {sub.applicantName}
                        </p>
                        <p className="text-label-sm text-outline font-mono">
                          {sub.indexNumber} • {sub.programme}
                        </p>
                      </div>

                      {/* Total to Send Highlight */}
                      <div className="text-right shrink-0 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/40">
                        <span className="text-[10px] text-outline uppercase font-bold block">Total to Send</span>
                        <p className="font-mono font-bold text-primary text-body-md">
                          {sub.totalExpectedGHS}
                        </p>
                      </div>
                    </div>

                    {/* Items summary preview snippet */}
                    <div className="mt-2.5 pt-2 border-t border-dashed border-outline-variant/50 text-[12px] text-on-surface-variant flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="material-symbols-outlined text-secondary text-[15px]">description</span>
                        <span className="font-medium truncate">
                          {sub.items.map((it) => `${it.quantity}x ${it.title}`).join(', ')}
                        </span>
                      </div>
                      <span className="text-outline font-mono text-[11px] shrink-0 ml-2">
                        {sub.submittedAt.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Full Detail & Financial Reconciliation Action */}
          <div className="lg:col-span-7">
            {selected ? (
              <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-6 shadow-sm space-y-6 sticky top-20">
                
                {/* Header of selected record */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-bold text-primary">
                        {selected.referenceNumber}
                      </span>
                      {statusBadge(selected.status)}
                    </div>
                    <p className="text-body-sm text-outline mt-0.5">
                      Submitted on <span className="font-mono">{selected.submittedAt}</span> via{' '}
                      <span className="font-semibold text-tertiary">{selected.channel}</span>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-label-sm text-outline uppercase font-bold block">Applicant Contact</span>
                    <span className="font-mono text-body-sm font-medium text-on-surface block">{selected.phone}</span>
                    <span className="text-label-sm text-outline truncate block">{selected.email}</span>
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* CRITICAL SECTION 1: WHAT THE PERSON IS REQUESTING FOR        */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">inventory_2</span>
                      <span>1. Requested Services &amp; Document Quantities</span>
                    </h3>
                    <span className="text-[11px] font-mono text-outline font-medium">
                      Student: {selected.indexNumber}
                    </span>
                  </div>

                  <div className="border border-outline-variant/60 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-body-sm">
                      <thead className="bg-surface-container-low text-label-sm uppercase font-bold text-outline border-b border-outline-variant/60">
                        <tr>
                          <th className="py-2.5 px-3.5">Document Service</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Price</th>
                          <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40">
                        {selected.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-lowest/50">
                            <td className="py-2.5 px-3.5">
                              <p className="font-semibold text-tertiary">{item.title}</p>
                              {item.details && (
                                <p className="text-[11px] text-outline">{item.details}</p>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-tertiary">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-on-surface-variant text-[12px]">
                              {item.unitPriceGHS}
                            </td>
                            <td className="py-2.5 px-3.5 text-right font-mono font-bold text-tertiary">
                              {item.subtotalGHS}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Delivery & Subtotal Summary Breakdown */}
                    <div className="bg-surface-container-low/70 p-3.5 border-t border-outline-variant/60 space-y-1.5 text-body-sm">
                      <div className="flex justify-between text-on-surface-variant text-label-md">
                        <span>Documents Subtotal:</span>
                        <span className="font-mono font-semibold">{selected.documentsSubtotalGHS}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant text-label-md">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[15px] text-outline">local_shipping</span>
                          <span className="truncate">Delivery ({selected.deliveryMethod}):</span>
                        </span>
                        <span className="font-mono font-semibold shrink-0 ml-2">{selected.deliveryFeeGHS}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* CRITICAL SECTION 2: THE TOTAL THE PERSON IS TO SEND          */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="p-4 rounded-xl bg-cug-green/5 border-2 border-cug-green/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cug-green/20 pb-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cug-green block">
                        Official Tariff Bill
                      </span>
                      <span className="text-title-md font-bold text-primary">
                        Total Amount Student Must Send:
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl font-black text-cug-green block">
                        {selected.totalExpectedGHS}
                      </span>
                      <span className="text-[11px] text-outline font-mono">
                        Ghana Cedis (100% full settlement required)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm pt-1">
                    <div>
                      <span className="text-outline text-label-sm block">Payment Channel Claimed:</span>
                      <span className="font-semibold text-tertiary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-secondary">
                          {selected.channel === 'Mobile Money' ? 'smartphone' : 'account_balance'}
                        </span>
                        <span>{selected.channelDetails}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-outline text-label-sm block">Required Narration / Reference:</span>
                      <span className="font-mono font-bold text-primary bg-white px-2 py-0.5 rounded border border-outline-variant/60 inline-block">
                        {selected.referenceNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* SECTION 3: PROOF OF PAYMENT UPLOADED BY STUDENT              */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">image</span>
                    <span>2. Uploaded Payment Proof</span>
                  </h3>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-2xl">
                          {selected.proofType === 'image' ? 'photo_camera' : 'picture_as_pdf'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-tertiary text-body-sm">
                          {selected.proofType === 'image' ? 'Transfer Screenshot / Photo' : 'Bank Deposit Slip (PDF)'}
                        </p>
                        <p className="text-[11px] text-outline">
                          Uploaded with submission on {selected.submittedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert(`Opening proof for ${selected.referenceNumber} in viewer.`)}
                        className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-label-sm font-semibold text-primary hover:bg-surface-container transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        <span>View Full Proof</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────────── */}
                {/* SECTION 4: FINANCE AUDIT & RECONCILIATION ACTION             */}
                {/* ───────────────────────────────────────────────────────────── */}
                <div className="pt-2 border-t border-outline-variant/60 space-y-4">
                  <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">fact_check</span>
                    <span>3. Statement Reconciliation &amp; Financial Clearance</span>
                  </h3>

                  {selected.status === 'PENDING' && (
                    <div className="bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/70 space-y-4">
                      <div>
                        <label className="block text-label-sm font-bold text-on-surface mb-1">
                          Amount Credited in CUG Bank / MoMo Account:
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-body-md text-primary">GHS</span>
                          <input
                            type="number"
                            step="0.01"
                            value={confirmedAmount}
                            onChange={(e) => setConfirmedAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-48 font-mono font-bold text-body-md bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-cug-green focus:ring-1 focus:ring-cug-green"
                          />
                          <button
                            type="button"
                            onClick={() => setConfirmedAmount(selected.totalExpectedGHS.replace('GHS ', ''))}
                            className="text-label-sm text-secondary hover:underline font-semibold"
                          >
                            Set to Expected ({selected.totalExpectedGHS})
                          </button>
                        </div>
                        <p className="text-[11px] text-outline mt-1">
                          Verify against your official statement before clearing.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(selected.id)}
                          className="flex-1 py-3 px-4 rounded-xl bg-cug-green text-white font-title-sm font-bold hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <span className="material-symbols-outlined text-xl">check_circle</span>
                          <span>Confirm Credit &amp; Grant Financial Clearance</span>
                        </button>
                      </div>

                      {/* Rejection / Discrepancy drawer */}
                      <div className="border-t border-dashed border-outline-variant/70 pt-3 space-y-2">
                        <label className="text-label-sm font-bold text-error flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">report_problem</span>
                          <span>Discrepancy / Rejection Reason (Required to Reject):</span>
                        </label>
                        <textarea
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="e.g. Underpayment: Received GHS 50.00 instead of GHS 90.00; OR Unreadable screenshot; OR No matching credit found in statement."
                          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-2.5 text-body-sm focus:border-error resize-none"
                        />
                        <button
                          type="button"
                          disabled={!rejectReason.trim()}
                          onClick={() => handleReject(selected.id)}
                          className="py-2.5 px-4 rounded-lg border-2 border-error text-error font-semibold text-label-md hover:bg-error/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-base">cancel</span>
                          <span>Reject Payment &amp; Notify Student with Reason</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {selected.status === 'APPROVED' && (
                    <div className="bg-cug-green/10 border border-cug-green/30 rounded-xl p-4 space-y-2 text-cug-green">
                      <div className="flex items-center gap-2 font-bold text-title-sm">
                        <span className="material-symbols-outlined text-2xl">verified</span>
                        <span>Financial Clearance Granted</span>
                      </div>
                      <div className="text-body-sm text-on-surface-variant space-y-0.5 font-mono text-[12px]">
                        <p>• Verified Credit: <strong className="text-cug-green">{selected.amountReceivedGHS}</strong> against expected <strong>{selected.totalExpectedGHS}</strong></p>
                        <p>• Verified By: {selected.verifiedBy}</p>
                        <p>• Date Cleared: {selected.verifiedAt}</p>
                      </div>
                      <p className="text-[12px] text-cug-green font-semibold pt-1">
                        Order has been queued for Academic Records processing and Registrar seal.
                      </p>
                    </div>
                  )}

                  {selected.status === 'REJECTED' && (
                    <div className="bg-error/10 border border-error/30 rounded-xl p-4 space-y-2 text-error">
                      <div className="flex items-center gap-2 font-bold text-title-sm">
                        <span className="material-symbols-outlined text-2xl">error</span>
                        <span>Payment Rejected / Clearance Withheld</span>
                      </div>
                      <p className="text-body-sm font-medium">
                        <strong>Reason given to student:</strong> {selected.rejectionReason}
                      </p>
                      {selected.verifiedBy && (
                        <p className="text-[11px] text-outline font-mono">
                          Audited by: {selected.verifiedBy} on {selected.verifiedAt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl flex items-center justify-center h-64 text-center p-6 text-on-surface-variant">
                <div>
                  <span className="material-symbols-outlined text-outline text-5xl mb-2">touch_app</span>
                  <p className="text-title-sm font-medium">Select a student request from the left list to review details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: UNIVERSITY ACCOUNT SETTINGS                                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          {settingsSaved && (
            <div className="flex items-center gap-2 p-4 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green font-semibold text-body-sm">
              <span className="material-symbols-outlined">check_circle</span>
              Payment details updated and saved. Students will see the new details immediately.
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-body-sm text-amber-900">
            <span className="material-symbols-outlined text-amber-600 shrink-0 mt-0.5">info</span>
            <span>
              Changes made here update the account numbers and instructions shown to students at Step 3 checkout. Always verify account numbers before saving.
            </span>
          </div>

          {/* Mobile Money Accounts */}
          <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
              <h2 className="text-title-md text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">smartphone</span>
                Mobile Money Accounts
              </h2>
              <button
                type="button"
                onClick={() => setEditingMomo((v) => !v)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-label-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">{editingMomo ? 'close' : 'edit'}</span>
                <span>{editingMomo ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {momoSettings.map((net, idx) => (
                <div key={idx} className="p-4 border border-outline-variant/50 rounded-xl space-y-3 bg-surface-container-low/30">
                  <p className="font-bold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cug-green" />
                    <span>{net.network}</span>
                  </p>

                  {editingMomo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          ['accountNumber', 'Mobile Number'],
                          ['accountName', 'Account Name'],
                          ['instructions', 'Payment Instructions for Students'],
                        ] as const
                      ).map(([field, label]) => (
                        <div key={field} className={field === 'instructions' ? 'sm:col-span-2' : ''}>
                          <label className="block text-label-sm text-on-surface mb-1 font-semibold">{label}</label>
                          {field === 'instructions' ? (
                            <textarea
                              rows={2}
                              value={net[field]}
                              onChange={(e) =>
                                setMomoSettings((prev) =>
                                  prev.map((n, i) => (i === idx ? { ...n, [field]: e.target.value } : n))
                                )
                              }
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-primary resize-none bg-white"
                            />
                          ) : (
                            <input
                              type="text"
                              value={net[field]}
                              onChange={(e) =>
                                setMomoSettings((prev) =>
                                  prev.map((n, i) => (i === idx ? { ...n, [field]: e.target.value } : n))
                                )
                              }
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-mono focus:border-primary bg-white"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm">
                      <div>
                        <span className="text-outline text-label-sm block">Number</span>
                        <span className="font-mono font-bold text-on-surface">{net.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-outline text-label-sm block">Name</span>
                        <span className="font-medium text-on-surface">{net.accountName}</span>
                      </div>
                      <div className="sm:col-span-2 text-on-surface-variant text-[12px] pt-1">
                        <span className="text-outline text-[11px] uppercase font-bold block">Instructions</span>
                        <span>{net.instructions}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bank Transfer Account */}
          <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2.5">
              <h2 className="text-title-md text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">account_balance</span>
                Bank Transfer Account
              </h2>
              <button
                type="button"
                onClick={() => setEditingBank((v) => !v)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-label-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">{editingBank ? 'close' : 'edit'}</span>
                <span>{editingBank ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {editingBank ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    ['bankName', 'Bank Name'],
                    ['branch', 'Branch'],
                    ['accountName', 'Account Name'],
                    ['accountNumber', 'Account Number'],
                    ['sortCode', 'Sort Code'],
                    ['swiftCode', 'SWIFT / BIC'],
                    ['instructions', 'Instructions to Students'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field} className={field === 'instructions' ? 'sm:col-span-2' : ''}>
                    <label className="block text-label-sm text-on-surface mb-1 font-semibold">{label}</label>
                    {field === 'instructions' ? (
                      <textarea
                        rows={2}
                        value={bankSettings[field]}
                        onChange={(e) => setBankSettings((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-primary resize-none bg-white"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bankSettings[field]}
                        onChange={(e) => setBankSettings((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-mono focus:border-primary bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-body-sm">
                {[
                  ['Bank', bankSettings.bankName],
                  ['Branch', bankSettings.branch],
                  ['Account Name', bankSettings.accountName],
                  ['Account Number', bankSettings.accountNumber],
                  ['Sort Code', bankSettings.sortCode],
                  ['SWIFT / BIC', bankSettings.swiftCode],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span className="text-outline text-label-sm block">{k}</span>
                    <span className="font-mono font-bold text-on-surface">{v}</span>
                  </div>
                ))}
                <div className="sm:col-span-2 text-on-surface-variant text-[12px] pt-1">
                  <span className="text-outline text-[11px] uppercase font-bold block">Instructions to Students</span>
                  <span>{bankSettings.instructions}</span>
                </div>
              </div>
            )}
          </section>

          {(editingMomo || editingBank) && (
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-8 py-3 rounded-xl bg-cug-green text-white font-bold text-label-md hover:bg-cug-green-light transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Save Payment Details</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
