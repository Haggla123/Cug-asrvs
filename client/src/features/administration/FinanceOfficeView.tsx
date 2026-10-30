import React, { useState } from 'react';
import type { AcademicServiceDefinition, DeliveryMethod, AcademicServiceCode } from '../../types';
import { PAYMENT_SETTINGS } from '../../lib/constants';
import { TariffStorage } from '../../lib/tariffStorage';

// ---------------------------------------------------------------------------
// FINANCE OFFICE PORTAL
// Key Responsibilities:
//   1. Tariffs & Fees: Set official prices for all documents and delivery options
//   2. Statement Reconciliation: Match Index Number (Ref) & Sender Name to clear orders
//   3. University Accounts: Manage MoMo wallets and Bank accounts for student checkout
// ---------------------------------------------------------------------------

type ProofStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type FinanceTab = 'proofs' | 'tariffs' | 'settings';

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
  indexNumber: string;
  applicantName: string;
  senderAccountName: string;
  programme: string;
  phone: string;
  email: string;
  channel: 'Mobile Money' | 'Bank Transfer';
  channelDetails: string;
  submittedAt: string;
  status: ProofStatus;
  proofType: 'image' | 'pdf';
  proofUrl?: string;

  items: RequestedDocumentItem[];
  deliveryMethod: string;
  deliveryFeeGHS: string;
  documentsSubtotalGHS: string;
  totalExpectedGHS: string;

  amountReceivedGHS?: string;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

const DEMO_SUBMISSIONS: PaymentSubmission[] = [
  {
    id: 'sub_001',
    referenceNumber: 'CUG-REQ-2026-4821',
    indexNumber: 'CUG/2021/0034',
    applicantName: 'Akosua Mensah',
    senderAccountName: 'Akosua Mensah',
    programme: 'BSc. Information Technology',
    phone: '0244123456',
    email: 'a.mensah@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'MTN MoMo (0244123456)',
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
        details: "Bachelor's Degree • Official Seal"
      },
      {
        title: 'English Proficiency Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 40.00',
        subtotalGHS: 'GHS 40.00',
        details: 'Medium of Instruction Certification'
      }
    ],
    deliveryMethod: 'Self-Pickup (Fiapre Campus)',
    deliveryFeeGHS: 'FREE (GHS 0.00)',
    documentsSubtotalGHS: 'GHS 90.00',
    totalExpectedGHS: 'GHS 90.00',
  },
  {
    id: 'sub_002',
    referenceNumber: 'CUG-REQ-2026-3317',
    indexNumber: 'CUG/2020/0128',
    applicantName: 'Kofi Asante',
    senderAccountName: 'Kwame Asante (Sponsor / Father)',
    programme: 'BSc. Accounting',
    phone: '0208765432',
    email: 'k.asante@alumni.cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Transfer (Sunyani Branch)',
    submittedAt: '2026-10-30 10:02',
    status: 'PENDING',
    proofType: 'pdf',
    items: [
      {
        title: 'Official Academic Transcript',
        quantity: 2,
        unitPriceGHS: 'GHS 50.00',
        subtotalGHS: 'GHS 100.00',
        details: "Bachelor's Degree"
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 100.00',
    totalExpectedGHS: 'GHS 150.00',
  },
  {
    id: 'sub_003',
    referenceNumber: 'CUG-REQ-2026-1195',
    indexNumber: 'CUG/2019/0577',
    applicantName: 'Ama Darko',
    senderAccountName: 'Ama Darko',
    programme: 'BSc. Public Health',
    phone: '0551239876',
    email: 'ama.darko@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'Telecel Cash (0551239876)',
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
      },
      {
        title: 'Academic Recommendation Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 40.00',
        subtotalGHS: 'GHS 40.00',
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 75.00',
    totalExpectedGHS: 'GHS 125.00',
  },
  {
    id: 'sub_004',
    referenceNumber: 'CUG-REQ-2026-0882',
    indexNumber: 'CUG/2022/0213',
    applicantName: 'Yaw Boateng',
    senderAccountName: 'Yaw Boateng',
    programme: 'B.Ed. Mathematics',
    phone: '0279876543',
    email: 'y.boateng@cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Deposit',
    submittedAt: '2026-10-28 11:30',
    status: 'REJECTED',
    proofType: 'pdf',
    amountReceivedGHS: 'GHS 40.00',
    rejectionReason: 'Discrepancy: Received GHS 40.00 instead of required GHS 85.00 (Courier fee missing).',
    verifiedBy: 'Mrs. Janet Antwi (Finance Officer)',
    verifiedAt: '2026-10-28 12:15',
    items: [
      {
        title: 'Attestation Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 35.00',
        subtotalGHS: 'GHS 35.00',
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 35.00',
    totalExpectedGHS: 'GHS 85.00',
  },
];

const statusBadge = (status: ProofStatus) => {
  if (status === 'APPROVED')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cug-green/10 text-cug-green text-[10px] font-bold uppercase tracking-wide">
        <span className="material-symbols-outlined text-[12px]">check_circle</span>
        Cleared
      </span>
    );
  if (status === 'REJECTED')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-wide">
        <span className="material-symbols-outlined text-[12px]">cancel</span>
        Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wide border border-amber-300">
      <span className="material-symbols-outlined text-[12px] text-amber-700">schedule</span>
      Pending
    </span>
  );
};

export const FinanceOfficeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('tariffs');
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(DEMO_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_SUBMISSIONS[0].id);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProofStatus | 'ALL'>('ALL');
  const [confirmedAmount, setConfirmedAmount] = useState<string>('');

  // ─── TARIFFS STATE (Category B Configuration Managed by Finance) ───────────
  const [servicesCatalogue, setServicesCatalogue] = useState<AcademicServiceDefinition[]>(() =>
    TariffStorage.getServicesCatalogue()
  );
  const [deliveryFees, setDeliveryFees] = useState<Record<DeliveryMethod, number>>(() =>
    TariffStorage.getDeliveryFees()
  );
  const [tariffSavedNotification, setTariffSavedNotification] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCode, setNewServiceCode] = useState<AcademicServiceCode>('ATTESTATION');
  const [newServicePriceGHS, setNewServicePriceGHS] = useState('40.00');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceBadge, setNewServiceBadge] = useState('Standard');

  // ─── PAYMENT RECEIVING ACCOUNTS STATE ──────────────────────────────────────
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
    setShowRejectBox(false);
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
    setShowRejectBox(false);
    setRejectReason('');
  };

  // ─── TARIFF HANDLERS ───────────────────────────────────────────────────────
  const handleDocumentPriceChange = (serviceId: string, newPriceGHS: string) => {
    const parsedGHS = parseFloat(newPriceGHS);
    const pesewas = isNaN(parsedGHS) ? 0 : Math.round(parsedGHS * 100);
    setServicesCatalogue((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, basePricePesewas: Math.max(0, pesewas) } : s))
    );
  };

  const handleDeliveryFeeChange = (method: DeliveryMethod, newFeeGHS: string) => {
    const parsedGHS = parseFloat(newFeeGHS);
    const pesewas = isNaN(parsedGHS) ? 0 : Math.round(parsedGHS * 100);
    setDeliveryFees((prev) => ({
      ...prev,
      [method]: Math.max(0, pesewas),
    }));
  };

  const handleSaveAllTariffs = () => {
    TariffStorage.saveServicesCatalogue(servicesCatalogue);
    TariffStorage.saveDeliveryFees(deliveryFees);
    setTariffSavedNotification(true);
    setTimeout(() => setTariffSavedNotification(false), 4000);
  };

  const handleResetTariffsToDefault = () => {
    if (window.confirm('Reset all document prices and delivery fees back to official university defaults?')) {
      const defaults = TariffStorage.resetDefaults();
      setServicesCatalogue(defaults.services);
      setDeliveryFees(defaults.deliveryFees);
      setTariffSavedNotification(true);
      setTimeout(() => setTariffSavedNotification(false), 3000);
    }
  };

  const handleAddNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const parsedGHS = parseFloat(newServicePriceGHS);
    const pesewas = isNaN(parsedGHS) ? 3500 : Math.round(parsedGHS * 100);
    const newService: AcademicServiceDefinition = {
      id: `srv_${Date.now()}`,
      code: newServiceCode,
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim() || 'Official registry certified document issued by the Academic Affairs Directorate.',
      basePricePesewas: pesewas,
      badgeText: newServiceBadge.trim() || 'Registry Certified',
      requiresPurpose: newServiceCode === 'ATTESTATION',
      requiresLevel: newServiceCode === 'TRANSCRIPT',
      requiresLecturer: newServiceCode === 'RECOMMENDATION',
      requiresDocument: newServiceCode === 'CERTIFIED_COPY',
    };

    const updated = [...servicesCatalogue, newService];
    setServicesCatalogue(updated);
    TariffStorage.saveServicesCatalogue(updated);
    setShowAddServiceModal(false);
    setNewServiceTitle('');
    setNewServiceDesc('');
    setTariffSavedNotification(true);
    setTimeout(() => setTariffSavedNotification(false), 3000);
  };

  const handleRemoveService = (serviceId: string) => {
    if (servicesCatalogue.length <= 1) {
      alert('The catalogue must contain at least one document service.');
      return;
    }
    if (window.confirm('Remove this document from the active registry catalogue?')) {
      const updated = servicesCatalogue.filter((s) => s.id !== serviceId);
      setServicesCatalogue(updated);
      TariffStorage.saveServicesCatalogue(updated);
    }
  };

  const handleSaveAccounts = () => {
    setEditingMomo(false);
    setEditingBank(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filtered =
    filterStatus === 'ALL' ? submissions : submissions.filter((s) => s.status === filterStatus);

  return (
    <div className="space-y-5 pb-16">
      {/* Header Banner */}
      <div className="bg-cug-green-dark text-white rounded-xl px-5 py-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-l-4 border-cug-gold">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cug-gold/20 border border-cug-gold/40 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-cug-gold text-2xl">account_balance</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase text-cug-gold font-bold">
                Directorate of Finance • Fiapre-Sunyani
              </span>
            </div>
            <h1 className="text-title-lg font-serif font-bold text-white tracking-tight leading-tight">
              Finance Office Administration &amp; Tariffs
            </h1>
            <p className="text-white/70 text-[12px]">
              Set official document tariffs &amp; courier fees, reconcile student credits against requested services, and manage receiving accounts.
            </p>
          </div>
        </div>

        {pending.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-300/40 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-amber-300 text-base">pending_actions</span>
            <span className="text-amber-200 font-bold text-label-md">
              {pending.length} Pending {pending.length === 1 ? 'Clearance' : 'Clearances'}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-surface-container-low rounded-lg p-1 w-fit border border-outline-variant/40 flex-wrap">
        {[
          ['tariffs', 'price_change', 'Document Prices & Delivery Fees'],
          ['proofs', 'receipt_long', 'Student Payment Clearances'],
          ['settings', 'tune', 'Receiving Accounts (MoMo & Bank)'],
        ].map(([tab, icon, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab as FinanceTab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-label-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-cug-green text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: DOCUMENT PRICES & DELIVERY FEES (MANAGED BY FINANCE)         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tariffs' && (
        <div className="space-y-6">
          {/* Notification Banner */}
          {tariffSavedNotification && (
            <div className="flex items-center justify-between p-3.5 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green text-body-sm font-semibold shadow-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span>Official Tariffs Updated! New document prices and delivery fees are now active across the request wizard and landing page.</span>
              </div>
              <span className="text-[11px] font-mono uppercase bg-cug-green/20 px-2 py-0.5 rounded text-cug-green font-bold">
                Live in System
              </span>
            </div>
          )}

          {/* Quick Info Strip */}
          <div className="bg-surface-container-low/60 rounded-xl p-4 border border-outline-variant/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-title-sm font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">gavel</span>
                <span>Official Academic Tariff Schedule (Category B Configuration)</span>
              </h2>
              <p className="text-[12px] text-outline">
                The Finance Directorate establishes and updates all fees charged to students for academic records, letters, certified copies, and courier dispatch.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetTariffsToDefault}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-[11px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                title="Restore default university pricing"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(true)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container-lowest border border-cug-green/40 text-cug-green font-bold text-[11px] hover:bg-cug-green/5 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add Document Service</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAllTariffs}
                className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-[12px] hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Tariff Changes</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SECTION A: DOCUMENT PRICES (8 cols) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/40">
                <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">description</span>
                  <span>Academic Document Tariffs ({servicesCatalogue.length} Services)</span>
                </h3>
                <span className="text-[11px] text-outline">Unit price charged per single copy</span>
              </div>

              <div className="space-y-2.5">
                {servicesCatalogue.map((service) => {
                  const currentPriceGHS = (service.basePricePesewas / 100).toFixed(2);
                  return (
                    <div
                      key={service.id}
                      className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4 shadow-2xs hover:border-cug-green/40 transition-all space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-on-surface text-body-md">
                              {service.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-container-low text-outline border border-outline-variant/40">
                              {service.code}
                            </span>
                            {service.badgeText && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cug-gold/20 text-cug-green-dark border border-cug-gold/40">
                                {service.badgeText}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-on-surface-variant mt-0.5 line-clamp-1">
                            {service.description}
                          </p>
                        </div>

                        {/* Price Input Block */}
                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/60">
                            <span className="text-[11px] font-bold text-primary font-mono">GHS</span>
                            <input
                              type="number"
                              step="1.00"
                              min="0"
                              value={currentPriceGHS}
                              onChange={(e) => handleDocumentPriceChange(service.id, e.target.value)}
                              className="w-20 bg-surface-container-lowest font-mono font-bold text-sm text-primary px-2 py-0.5 border border-outline-variant rounded focus:border-cug-green text-right"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveService(service.id)}
                            className="text-outline hover:text-error transition-colors p-1"
                            title="Remove document from catalogue"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Detail tags */}
                      <div className="flex items-center gap-3 pt-1 border-t border-dashed border-outline-variant/40 text-[11px] text-outline">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-cug-green">check_circle</span>
                          <span>In Pesewas: <strong className="font-mono text-tertiary">{service.basePricePesewas} pesewas</strong></span>
                        </span>
                        {service.requiresLevel && <span>• Degree Level Selection Required</span>}
                        {service.requiresPurpose && <span>• Purpose Statement Required</span>}
                        {service.requiresDocument && <span>• Certificate Upload Required</span>}
                        {service.requiresLecturer && <span>• Lecturer Nomination Required</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION B: DELIVERY & COURIER FEES (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="pb-1 border-b border-outline-variant/40">
                <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-lg">local_shipping</span>
                  <span>Delivery &amp; Courier Fees</span>
                </h3>
                <span className="text-[11px] text-outline">Fulfillment charges added to order total</span>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4 shadow-2xs space-y-3.5">
                {[
                  {
                    method: 'DOMESTIC_COURIER' as DeliveryMethod,
                    title: 'Ghana Post EMS (Domestic)',
                    desc: 'Nationwide dispatch to all 16 regions',
                    icon: 'local_post_office',
                    fee: deliveryFees.DOMESTIC_COURIER,
                  },
                  {
                    method: 'INTERNATIONAL_COURIER' as DeliveryMethod,
                    title: 'DHL Express (International)',
                    desc: 'Tracked worldwide courier dispatch',
                    icon: 'flight_takeoff',
                    fee: deliveryFees.INTERNATIONAL_COURIER,
                  },
                  {
                    method: 'EMAIL' as DeliveryMethod,
                    title: 'Electronic Official PDF',
                    desc: 'Direct email delivery to recipient',
                    icon: 'mail',
                    fee: deliveryFees.EMAIL,
                  },
                  {
                    method: 'SELF_PICKUP' as DeliveryMethod,
                    title: 'Self-Pickup (Fiapre Campus)',
                    desc: 'Academic Affairs Office Desk',
                    icon: 'storefront',
                    fee: deliveryFees.SELF_PICKUP,
                  },
                  {
                    method: 'PROXY_PICKUP' as DeliveryMethod,
                    title: 'Authorized Proxy Pickup',
                    desc: 'Representative collection in person',
                    icon: 'group',
                    fee: deliveryFees.PROXY_PICKUP,
                  },
                ].map((item) => (
                  <div key={item.method} className="space-y-1 pb-3 border-b border-outline-variant/40 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-body-sm text-tertiary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-secondary">{item.icon}</span>
                        <span>{item.title}</span>
                      </span>
                      <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/60">
                        <span className="text-[10px] font-bold text-primary font-mono">GHS</span>
                        <input
                          type="number"
                          step="1.00"
                          min="0"
                          value={(item.fee / 100).toFixed(2)}
                          onChange={(e) => handleDeliveryFeeChange(item.method, e.target.value)}
                          className="w-16 bg-surface-container-lowest font-mono font-bold text-xs text-primary px-1.5 py-0.5 border border-outline-variant rounded focus:border-cug-green text-right"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-outline pl-5">{item.desc}</p>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleSaveAllTariffs}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-cug-green text-white font-bold text-label-sm hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Apply All Pricing Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* ADD DOCUMENT SERVICE MODAL */}
          {showAddServiceModal && (
            <div className="fixed inset-0 z-50 bg-tertiary/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/80 space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
                  <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary">add_circle</span>
                    <span>Add New Document Tariff</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddServiceModal(false)}
                    className="text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                <form onSubmit={handleAddNewService} className="space-y-3 text-body-sm">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceTitle}
                      onChange={(e) => setNewServiceTitle(e.target.value)}
                      placeholder="e.g. Visa Attestation Letter"
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-cug-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase tracking-wider">
                        Document Code
                      </label>
                      <select
                        value={newServiceCode}
                        onChange={(e) => setNewServiceCode(e.target.value as AcademicServiceCode)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2.5 py-2 font-mono text-xs focus:border-cug-green"
                      >
                        <option value="TRANSCRIPT">TRANSCRIPT</option>
                        <option value="ENGLISH_PROFICIENCY">ENGLISH_PROFICIENCY</option>
                        <option value="ATTESTATION">ATTESTATION</option>
                        <option value="CERTIFIED_COPY">CERTIFIED_COPY</option>
                        <option value="RECOMMENDATION">RECOMMENDATION</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase tracking-wider">
                        Price (GHS) *
                      </label>
                      <input
                        type="number"
                        step="0.50"
                        min="0"
                        required
                        value={newServicePriceGHS}
                        onChange={(e) => setNewServicePriceGHS(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-mono font-bold text-on-surface focus:border-cug-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={newServiceBadge}
                      onChange={(e) => setNewServiceBadge(e.target.value)}
                      placeholder="e.g. Seal Included, Express"
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-cug-green text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-on-surface mb-1 uppercase tracking-wider">
                      Official Description
                    </label>
                    <textarea
                      rows={2}
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="Brief registry description of the certified document..."
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface focus:border-cug-green text-xs resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/60">
                    <button
                      type="button"
                      onClick={() => setShowAddServiceModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-outline-variant text-[12px] font-medium text-outline hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-[12px] hover:bg-cug-green-light"
                    >
                      Add to Tariff Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: STUDENT PAYMENT CLEARANCES & RECONCILIATION                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'proofs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (5 cols): Submissions List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between gap-1.5 pb-1">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Queue:</span>
              <div className="flex gap-1">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterStatus(f)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      filterStatus === f
                        ? 'bg-primary text-white border-primary'
                        : 'border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? 'Pending' : f === 'APPROVED' ? 'Cleared' : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((sub) => {
                const isSelected = selectedId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`bg-surface-container-lowest border rounded-xl p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cug-green ring-2 ring-cug-green/30 bg-cug-green/[0.02] shadow-sm'
                        : 'border-outline-variant/70 hover:border-cug-green/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-primary text-[12px] bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant/50">
                            Ref: {sub.indexNumber}
                          </span>
                          {statusBadge(sub.status)}
                        </div>
                        <p className="font-bold text-on-surface text-body-sm mt-1 truncate">
                          {sub.applicantName}
                        </p>
                        <p className="text-[11px] text-outline truncate">
                          Name on Account: <strong className="text-tertiary">{sub.senderAccountName}</strong>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-outline uppercase font-bold block">Total Expected</span>
                        <p className="font-mono font-bold text-primary text-body-md">
                          {sub.totalExpectedGHS}
                        </p>
                        <span className="text-[10px] text-outline font-mono">{sub.channel.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): COMPACT Detail & Verification Panel */}
          <div className="lg:col-span-7">
            {selected ? (
              <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex items-start justify-between gap-2 border-b border-outline-variant/50 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-title-md font-bold text-primary">
                        {selected.referenceNumber}
                      </span>
                      {statusBadge(selected.status)}
                    </div>
                    <p className="text-[11px] text-outline font-mono">
                      Submitted: {selected.submittedAt} • {selected.channelDetails}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-body-sm font-medium text-on-surface block">{selected.phone}</span>
                    <span className="text-[11px] text-outline">{selected.programme}</span>
                  </div>
                </div>

                {/* CRITICAL STATEMENT VERIFICATION STRIP */}
                <div className="bg-cug-green/5 border-2 border-cug-green/30 rounded-lg p-3">
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                        Statement Ref (Index No.)
                      </span>
                      <span className="font-mono font-bold text-sm text-primary bg-white px-1.5 py-0.5 rounded border border-outline-variant/60 inline-block">
                        {selected.indexNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                        Name on Account (Sender)
                      </span>
                      <span className="font-bold text-sm text-tertiary truncate block" title={selected.senderAccountName}>
                        {selected.senderAccountName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cug-green block">
                        Total to Confirm
                      </span>
                      <span className="font-mono font-black text-lg text-cug-green">
                        {selected.totalExpectedGHS}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REQUESTED SERVICES & DELIVERY */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-label-sm font-bold text-primary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                      <span>Requested Services:</span>
                    </span>
                    <span className="font-mono text-[11px] text-outline font-normal">
                      Delivery: {selected.deliveryMethod} ({selected.deliveryFeeGHS})
                    </span>
                  </div>

                  <div className="bg-surface-container-low rounded-lg p-2.5 divide-y divide-outline-variant/40 space-y-1 text-body-sm">
                    {selected.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1 first:pt-0">
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-tertiary text-[13px]">{item.title}</span>
                          <span className="text-outline text-[11px] ml-1.5 font-mono">
                            ({item.quantity} {item.quantity === 1 ? 'copy' : 'copies'} @ {item.unitPriceGHS})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-tertiary text-[13px] shrink-0">
                          {item.subtotalGHS}
                        </span>
                      </div>
                    ))}
                    <div className="pt-1.5 flex justify-between font-bold text-[12px] text-on-surface">
                      <span>Total (Docs {selected.documentsSubtotalGHS} + Delivery {selected.deliveryFeeGHS}):</span>
                      <span className="font-mono text-primary text-[13px]">{selected.totalExpectedGHS}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT PROOF & CLEARANCE ACTIONS */}
                <div className="pt-1 border-t border-outline-variant/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[18px]">receipt</span>
                      <span className="text-label-sm font-bold text-primary">Uploaded Proof:</span>
                      <button
                        type="button"
                        onClick={() => alert(`Opening ${selected.proofType.toUpperCase()} proof for ${selected.referenceNumber}.`)}
                        className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-[11px] font-semibold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[13px]">visibility</span>
                        <span>View {selected.proofType.toUpperCase()}</span>
                      </button>
                    </div>

                    {selected.status === 'APPROVED' && (
                      <span className="text-cug-green text-[12px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        Cleared by {selected.verifiedBy?.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {selected.status === 'PENDING' && (
                    <div className="bg-surface-container-low/40 rounded-lg p-2.5 border border-outline-variant/60 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] font-bold text-on-surface">Credited Amount:</label>
                          <span className="font-mono text-xs font-bold text-primary">GHS</span>
                          <input
                            type="number"
                            step="0.01"
                            value={confirmedAmount}
                            onChange={(e) => setConfirmedAmount(e.target.value)}
                            className="w-24 font-mono font-bold text-xs bg-surface-container-lowest border border-outline-variant rounded px-2 py-1 text-on-surface"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRejectBox(!showRejectBox)}
                            className="px-3 py-1.5 rounded-lg border border-error/50 text-error font-semibold text-[11px] hover:bg-error/5 transition-colors"
                          >
                            Flag Discrepancy / Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(selected.id)}
                            className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-[12px] hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">check_circle</span>
                            <span>Issue Clearance</span>
                          </button>
                        </div>
                      </div>

                      {showRejectBox && (
                        <div className="pt-2 border-t border-outline-variant/40 space-y-1.5">
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for discrepancy (e.g. Underpayment: received GHS 40 vs expected GHS 90; or name on account mismatch)"
                            className="w-full bg-white border border-outline-variant rounded p-2 text-xs focus:border-error resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowRejectBox(false)}
                              className="text-[11px] text-outline hover:underline px-2 py-1"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={!rejectReason.trim()}
                              onClick={() => handleReject(selected.id)}
                              className="px-3 py-1 rounded bg-error text-white font-semibold text-[11px] hover:bg-error-container disabled:opacity-40"
                            >
                              Confirm Rejection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selected.status === 'APPROVED' && (
                    <div className="bg-cug-green/10 border border-cug-green/20 rounded p-2 text-[12px] text-cug-green flex items-center justify-between">
                      <span>✓ Verified Credit: <strong>{selected.amountReceivedGHS}</strong> against Index Ref <strong>{selected.indexNumber}</strong></span>
                      <span className="font-mono text-[11px] text-outline">{selected.verifiedAt}</span>
                    </div>
                  )}

                  {selected.status === 'REJECTED' && (
                    <div className="bg-error/10 border border-error/20 rounded p-2 text-[12px] text-error space-y-0.5">
                      <p className="font-bold">Rejection / Discrepancy Note:</p>
                      <p>{selected.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center h-48 text-center p-4 text-on-surface-variant">
                <p className="text-body-sm">Select a request from the left list to review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: RECEIVING ACCOUNTS (MOMO & BANK)                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="space-y-4 max-w-3xl">
          {settingsSaved && (
            <div className="flex items-center gap-2 p-3 bg-cug-green/10 border border-cug-green/30 rounded-lg text-cug-green font-semibold text-body-sm">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Payment receiving accounts updated and saved.
            </div>
          )}

          {/* MoMo Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
              <h2 className="text-title-sm font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">smartphone</span>
                Mobile Money Receiving Accounts
              </h2>
              <button
                type="button"
                onClick={() => setEditingMomo((v) => !v)}
                className="px-2.5 py-1 rounded text-label-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
              >
                {editingMomo ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-3">
              {momoSettings.map((net, idx) => (
                <div key={idx} className="p-3 border border-outline-variant/50 rounded-lg space-y-2 bg-surface-container-low/30 text-body-sm">
                  <p className="font-bold text-on-surface flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cug-green" />
                    <span>{net.network}</span>
                  </p>

                  {editingMomo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-outline block">Number</label>
                        <input
                          type="text"
                          value={net.accountNumber}
                          onChange={(e) =>
                            setMomoSettings((prev) =>
                              prev.map((n, i) => (i === idx ? { ...n, accountNumber: e.target.value } : n))
                            )
                          }
                          className="w-full border border-outline-variant rounded px-2 py-1 text-xs font-mono bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-outline block">Account Name</label>
                        <input
                          type="text"
                          value={net.accountName}
                          onChange={(e) =>
                            setMomoSettings((prev) =>
                              prev.map((n, i) => (i === idx ? { ...n, accountName: e.target.value } : n))
                            )
                          }
                          className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-outline block">Instructions</label>
                        <textarea
                          rows={2}
                          value={net.instructions}
                          onChange={(e) =>
                            setMomoSettings((prev) =>
                              prev.map((n, i) => (i === idx ? { ...n, instructions: e.target.value } : n))
                            )
                          }
                          className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white resize-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-outline block">Number:</span>
                        <span className="font-mono font-bold text-on-surface">{net.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-outline block">Name:</span>
                        <span className="font-medium text-on-surface">{net.accountName}</span>
                      </div>
                      <div className="col-span-2 text-outline pt-0.5">
                        <span className="font-semibold">Instructions:</span> {net.instructions}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Bank Settings */}
          <section className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant/50 pb-2">
              <h2 className="text-title-sm font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-base">account_balance</span>
                Bank Receiving Account
              </h2>
              <button
                type="button"
                onClick={() => setEditingBank((v) => !v)}
                className="px-2.5 py-1 rounded text-label-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
              >
                {editingBank ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="p-3 border border-outline-variant/50 rounded-lg space-y-2 bg-surface-container-low/30 text-xs">
              {editingBank ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-outline block">Bank Name</label>
                    <input
                      type="text"
                      value={bankSettings.bankName}
                      onChange={(e) => setBankSettings((p) => ({ ...p, bankName: e.target.value }))}
                      className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-outline block">Account Number</label>
                    <input
                      type="text"
                      value={bankSettings.accountNumber}
                      onChange={(e) => setBankSettings((p) => ({ ...p, accountNumber: e.target.value }))}
                      className="w-full border border-outline-variant rounded px-2 py-1 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-outline block">Account Name</label>
                    <input
                      type="text"
                      value={bankSettings.accountName}
                      onChange={(e) => setBankSettings((p) => ({ ...p, accountName: e.target.value }))}
                      className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-outline block">Branch</label>
                    <input
                      type="text"
                      value={bankSettings.branch}
                      onChange={(e) => setBankSettings((p) => ({ ...p, branch: e.target.value }))}
                      className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-outline block">Instructions</label>
                    <textarea
                      rows={2}
                      value={bankSettings.instructions}
                      onChange={(e) => setBankSettings((p) => ({ ...p, instructions: e.target.value }))}
                      className="w-full border border-outline-variant rounded px-2 py-1 text-xs bg-white resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-outline block">Bank:</span>
                    <span className="font-bold text-on-surface">{bankSettings.bankName}</span>
                  </div>
                  <div>
                    <span className="text-outline block">Account No:</span>
                    <span className="font-mono font-bold text-on-surface">{bankSettings.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-outline block">Account Name:</span>
                    <span className="font-medium text-on-surface">{bankSettings.accountName}</span>
                  </div>
                  <div>
                    <span className="text-outline block">Branch:</span>
                    <span className="font-medium text-on-surface">{bankSettings.branch}</span>
                  </div>
                  <div className="col-span-2 text-outline pt-0.5">
                    <span className="font-semibold">Instructions:</span> {bankSettings.instructions}
                  </div>
                </div>
              )}
            </div>
          </section>

          {(editingMomo || editingBank) && (
            <button
              type="button"
              onClick={handleSaveAccounts}
              className="px-6 py-2 rounded-lg bg-cug-green text-white font-bold text-label-sm hover:bg-cug-green-light transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Save Receiving Accounts</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
