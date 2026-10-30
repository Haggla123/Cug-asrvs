import React, { useState } from 'react';
import { PAYMENT_SETTINGS } from '../../lib/constants';

// ---------------------------------------------------------------------------
// FINANCE OFFICE PORTAL
// Allows Finance Office staff to:
//   1. View and verify pending payment proofs submitted by students
//   2. Approve or reject payment submissions (with reason)
//   3. Update the MoMo and bank account details shown to students
//
// NOTE: In the live system this would connect to a secured REST API with
// role-based authentication.  This prototype uses local state only.
// ---------------------------------------------------------------------------

type ProofStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface PaymentSubmission {
  id: string;
  referenceNumber: string;
  applicantName: string;
  indexNumber: string;
  totalGHS: string;
  channel: 'Mobile Money' | 'Bank Transfer';
  submittedAt: string;
  status: ProofStatus;
  proofType: 'image' | 'pdf';
  rejectionReason?: string;
}

// Demo seed data
const DEMO_SUBMISSIONS: PaymentSubmission[] = [
  {
    id: 'sub_001',
    referenceNumber: 'CUG-REQ-2026-4821',
    applicantName: 'Akosua Mensah',
    indexNumber: 'CUG/2021/0034',
    totalGHS: 'GHS 90.00',
    channel: 'Mobile Money',
    submittedAt: '2026-10-30 09:14',
    status: 'PENDING',
    proofType: 'image',
  },
  {
    id: 'sub_002',
    referenceNumber: 'CUG-REQ-2026-3317',
    applicantName: 'Kofi Asante',
    indexNumber: 'CUG/2020/0128',
    totalGHS: 'GHS 50.00',
    channel: 'Bank Transfer',
    submittedAt: '2026-10-30 10:02',
    status: 'PENDING',
    proofType: 'pdf',
  },
  {
    id: 'sub_003',
    referenceNumber: 'CUG-REQ-2026-1195',
    applicantName: 'Ama Darko',
    indexNumber: 'CUG/2019/0577',
    totalGHS: 'GHS 130.00',
    channel: 'Mobile Money',
    submittedAt: '2026-10-29 16:45',
    status: 'APPROVED',
    proofType: 'image',
  },
  {
    id: 'sub_004',
    referenceNumber: 'CUG-REQ-2026-0882',
    applicantName: 'Yaw Boateng',
    indexNumber: 'CUG/2022/0213',
    totalGHS: 'GHS 75.00',
    channel: 'Bank Transfer',
    submittedAt: '2026-10-28 11:30',
    status: 'REJECTED',
    proofType: 'pdf',
    rejectionReason: 'Amount transferred does not match the order total. Student has been asked to resubmit.',
  },
];

type FinanceTab = 'proofs' | 'settings';

const statusBadge = (status: ProofStatus) => {
  if (status === 'APPROVED')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cug-green/10 text-cug-green text-[11px] font-bold uppercase tracking-wide"><span className="material-symbols-outlined text-[12px]">check_circle</span>Approved</span>;
  if (status === 'REJECTED')
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[11px] font-bold uppercase tracking-wide"><span className="material-symbols-outlined text-[12px]">cancel</span>Rejected</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wide"><span className="material-symbols-outlined text-[12px]">schedule</span>Pending</span>;
};

export const FinanceOfficeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('proofs');
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(DEMO_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProofStatus | 'ALL'>('ALL');

  // Payment settings edit state
  const [editingMomo, setEditingMomo] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [momoSettings, setMomoSettings] = useState(PAYMENT_SETTINGS.mobileMoney);
  const [bankSettings, setBankSettings] = useState(PAYMENT_SETTINGS.bankTransfer);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pending = submissions.filter((s) => s.status === 'PENDING');
  const selected = submissions.find((s) => s.id === selectedId) ?? null;

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'APPROVED' as const } : s))
    );
    setSelectedId(null);
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'REJECTED' as const, rejectionReason: rejectReason } : s
      )
    );
    setRejectReason('');
    setSelectedId(null);
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
      {/* Header */}
      <div className="bg-cug-green-dark text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cug-gold/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-cug-gold text-2xl">account_balance</span>
          </div>
          <div>
            <h1 className="text-headline-sm font-serif font-bold text-white">Finance Office Portal</h1>
            <p className="text-white/70 text-body-sm">Catholic University of Ghana — Payment Verification</p>
          </div>
        </div>
        {pending.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-400/20 border border-amber-400/40 rounded-xl">
            <span className="material-symbols-outlined text-amber-300 text-base">notifications_active</span>
            <span className="text-amber-200 font-semibold text-body-sm">{pending.length} pending {pending.length === 1 ? 'proof' : 'proofs'}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 w-fit">
        {([['proofs', 'receipt_long', 'Payment Proofs'], ['settings', 'tune', 'Payment Settings']] as const).map(([tab, icon, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${
              activeTab === tab
                ? 'bg-cug-green text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: PAYMENT PROOFS                                               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'proofs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Submissions list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Pending', count: submissions.filter(s => s.status === 'PENDING').length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                { label: 'Approved', count: submissions.filter(s => s.status === 'APPROVED').length, color: 'text-cug-green bg-cug-green/5 border-cug-green/20' },
                { label: 'Rejected', count: submissions.filter(s => s.status === 'REJECTED').length, color: 'text-error bg-error/5 border-error/20' },
              ].map(({ label, count, color }) => (
                <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
                  <p className="text-2xl font-bold font-mono">{count}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterStatus(f)}
                  className={`px-3 py-1 rounded-full text-label-md font-semibold border transition-all ${
                    filterStatus === f
                      ? 'bg-primary text-white border-primary'
                      : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <p className="text-center text-on-surface-variant py-10 text-body-md">No submissions match this filter.</p>
              )}
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedId(sub.id === selectedId ? null : sub.id)}
                  className={`bg-surface-container-lowest border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedId === sub.id
                      ? 'border-cug-green ring-1 ring-cug-green shadow-sm'
                      : 'border-outline-variant/70 hover:border-cug-green/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-primary text-[13px]">{sub.referenceNumber}</span>
                        {statusBadge(sub.status)}
                      </div>
                      <p className="font-semibold text-on-surface text-body-sm mt-0.5">{sub.applicantName}</p>
                      <p className="text-label-sm text-outline font-mono">{sub.indexNumber}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-primary text-body-md">{sub.totalGHS}</p>
                      <p className="text-[11px] text-outline">{sub.channel}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-outline">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">
                        {sub.proofType === 'image' ? 'image' : 'picture_as_pdf'}
                      </span>
                      {sub.proofType === 'image' ? 'Image proof' : 'PDF proof'}
                    </div>
                    <span>{sub.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Action panel */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="sticky top-20 bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-primary text-title-md border-b border-outline-variant/50 pb-2">
                  Review Submission
                </h3>

                <div className="space-y-2 text-body-sm">
                  {[
                    ['Reference', selected.referenceNumber],
                    ['Applicant', selected.applicantName],
                    ['Index', selected.indexNumber],
                    ['Amount', selected.totalGHS],
                    ['Channel', selected.channel],
                    ['Submitted', selected.submittedAt],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-outline text-label-sm">{k}</span>
                      <span className="font-medium text-on-surface text-right font-mono text-[12px]">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Proof placeholder */}
                <div className="bg-surface-container rounded-xl flex items-center justify-center h-36 border border-outline-variant/40">
                  <div className="text-center space-y-1">
                    <span className="material-symbols-outlined text-outline text-3xl">
                      {selected.proofType === 'image' ? 'image' : 'picture_as_pdf'}
                    </span>
                    <p className="text-label-sm text-outline">
                      {selected.proofType === 'image' ? 'Payment screenshot' : 'PDF receipt'}
                    </p>
                    <p className="text-[11px] text-outline/60">(File viewer — live system)</p>
                  </div>
                </div>

                {selected.status === 'PENDING' && (
                  <div className="space-y-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApprove(selected.id)}
                      className="w-full py-2.5 rounded-lg bg-cug-green text-white font-semibold text-label-md hover:bg-cug-green-light transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Approve Payment
                    </button>

                    <div className="space-y-1.5">
                      <label className="text-label-sm text-on-surface font-medium block">Rejection reason (required to reject)</label>
                      <textarea
                        rows={2}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Amount does not match order total…"
                        className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-error resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleReject(selected.id)}
                        disabled={!rejectReason.trim()}
                        className="w-full py-2.5 rounded-lg border-2 border-error text-error font-semibold text-label-md hover:bg-error/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-base">cancel</span>
                        Reject &amp; Notify Student
                      </button>
                    </div>
                  </div>
                )}

                {selected.status === 'APPROVED' && (
                  <div className="flex items-center gap-2 bg-cug-green/10 border border-cug-green/20 rounded-lg p-3 text-body-sm text-cug-green">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Payment verified and approved.
                  </div>
                )}

                {selected.status === 'REJECTED' && (
                  <div className="bg-error/5 border border-error/20 rounded-lg p-3 space-y-1">
                    <p className="text-label-sm font-bold text-error">Rejection Reason:</p>
                    <p className="text-body-sm text-error/80">{selected.rejectionReason}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center h-48 text-center p-4">
                <div>
                  <span className="material-symbols-outlined text-outline text-4xl">touch_app</span>
                  <p className="text-body-sm text-on-surface-variant mt-2">Select a submission to review &amp; take action</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: PAYMENT SETTINGS                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl">
          {settingsSaved && (
            <div className="flex items-center gap-2 p-4 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green font-semibold text-body-sm">
              <span className="material-symbols-outlined">check_circle</span>
              Payment details updated and saved. Students will see the new details immediately.
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-body-sm text-amber-800">
            <span className="material-symbols-outlined text-amber-600 shrink-0">info</span>
            <span>
              Changes here update the account details displayed to students during checkout. Ensure the details are correct before saving — incorrect details will lead to failed payments.
            </span>
          </div>

          {/* Mobile Money Settings */}
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
                {editingMomo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              {momoSettings.map((net, idx) => (
                <div key={idx} className="p-4 border border-outline-variant/50 rounded-xl space-y-3">
                  <p className="font-bold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cug-green" />
                    {net.network}
                  </p>

                  {editingMomo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(
                        [
                          ['accountNumber', 'Mobile Number'],
                          ['accountName', 'Account Name'],
                          ['instructions', 'Payment Instructions'],
                        ] as const
                      ).map(([field, label]) => (
                        <div key={field} className={field === 'instructions' ? 'sm:col-span-2' : ''}>
                          <label className="block text-label-sm text-on-surface mb-1">{label}</label>
                          {field === 'instructions' ? (
                            <textarea
                              rows={2}
                              value={net[field]}
                              onChange={(e) =>
                                setMomoSettings((prev) =>
                                  prev.map((n, i) => (i === idx ? { ...n, [field]: e.target.value } : n))
                                )
                              }
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-primary resize-none"
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
                              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-mono focus:border-primary"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-body-sm">
                      <div>
                        <span className="text-outline text-label-sm block">Number</span>
                        <span className="font-mono font-bold">{net.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-outline text-label-sm block">Name</span>
                        <span className="font-medium">{net.accountName}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bank Transfer Settings */}
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
                {editingBank ? 'Cancel' : 'Edit'}
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
                    ['instructions', 'Payment Instructions'],
                  ] as const
                ).map(([field, label]) => (
                  <div key={field} className={field === 'instructions' ? 'sm:col-span-2' : ''}>
                    <label className="block text-label-sm text-on-surface mb-1">{label}</label>
                    {field === 'instructions' ? (
                      <textarea
                        rows={2}
                        value={bankSettings[field]}
                        onChange={(e) => setBankSettings((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm focus:border-primary resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={bankSettings[field]}
                        onChange={(e) => setBankSettings((p) => ({ ...p, [field]: e.target.value }))}
                        className="w-full border border-outline-variant rounded-lg px-3 py-2 text-body-sm font-mono focus:border-primary"
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
                <div className="sm:col-span-2">
                  <span className="text-outline text-label-sm block">Instructions to Students</span>
                  <span className="text-on-surface">{bankSettings.instructions}</span>
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
              Save Payment Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};
