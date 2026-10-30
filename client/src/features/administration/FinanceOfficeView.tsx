import React, { useState } from 'react';
import type { AcademicServiceDefinition, DeliveryMethod, AcademicServiceCode } from '../../types';
import { PAYMENT_SETTINGS } from '../../lib/constants';
import { TariffStorage } from '../../lib/tariffStorage';

// ---------------------------------------------------------------------------
// MODERN FINANCE OFFICE WORKSTATION & TARIFF CONTROL PORTAL
// Catholic University of Ghana — Directorate of Finance
// ---------------------------------------------------------------------------

type ProofStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type FinanceTab = 'tariffs' | 'proofs' | 'settings';

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
  network?: 'MTN' | 'Telecel' | 'GCB';
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
    phone: '024 412 3456',
    email: 'a.mensah@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'MTN MoMo • 024 412 3456',
    network: 'MTN',
    submittedAt: 'Today, 09:14 AM',
    status: 'PENDING',
    proofType: 'image',
    proofUrl: '/cug-logo.png',
    items: [
      {
        title: 'Official Academic Transcript',
        quantity: 1,
        unitPriceGHS: 'GHS 50.00',
        subtotalGHS: 'GHS 50.00',
        details: "Bachelor's Degree • Embossed Registry Seal"
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
    indexNumber: 'CUG/2020/0128',
    applicantName: 'Kofi Asante',
    senderAccountName: 'Kwame Asante (Parent / Sponsor)',
    programme: 'BSc. Accounting',
    phone: '020 876 5432',
    email: 'k.asante@alumni.cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Transfer • Sunyani Branch',
    network: 'GCB',
    submittedAt: 'Today, 10:02 AM',
    status: 'PENDING',
    proofType: 'pdf',
    items: [
      {
        title: 'Official Academic Transcript',
        quantity: 2,
        unitPriceGHS: 'GHS 50.00',
        subtotalGHS: 'GHS 100.00',
        details: "Bachelor's Degree • For Master's Degree Admission"
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
    indexNumber: 'CUG/2019/0577',
    applicantName: 'Ama Darko',
    senderAccountName: 'Ama Darko',
    programme: 'BSc. Public Health (Nursing)',
    phone: '055 123 9876',
    email: 'ama.darko@alumni.cug.edu.gh',
    channel: 'Mobile Money',
    channelDetails: 'Telecel Cash • 055 123 9876',
    network: 'Telecel',
    submittedAt: 'Yesterday, 04:45 PM',
    status: 'APPROVED',
    proofType: 'image',
    amountReceivedGHS: 'GHS 125.00',
    verifiedBy: 'Mr. Emmanuel Osei (Senior Finance Officer)',
    verifiedAt: 'Yesterday, 05:10 PM',
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
        details: 'Dean, Faculty of Health & Allied Sciences'
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
    indexNumber: 'CUG/2022/0213',
    applicantName: 'Yaw Boateng',
    senderAccountName: 'Yaw Boateng',
    programme: 'B.Ed. Mathematics',
    phone: '027 987 6543',
    email: 'y.boateng@cug.edu.gh',
    channel: 'Bank Transfer',
    channelDetails: 'GCB Bank Deposit Slip',
    network: 'GCB',
    submittedAt: '28 Oct 2026, 11:30 AM',
    status: 'REJECTED',
    proofType: 'pdf',
    amountReceivedGHS: 'GHS 40.00',
    rejectionReason: 'Discrepancy: Received GHS 40.00 on bank slip instead of required GHS 85.00 (Courier dispatch fee missing).',
    verifiedBy: 'Mrs. Janet Antwi (Finance Officer)',
    verifiedAt: '28 Oct 2026, 12:15 PM',
    items: [
      {
        title: 'Attestation Letter',
        quantity: 1,
        unitPriceGHS: 'GHS 35.00',
        subtotalGHS: 'GHS 35.00',
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier (Accra)',
    deliveryFeeGHS: 'GHS 50.00',
    documentsSubtotalGHS: 'GHS 35.00',
    totalExpectedGHS: 'GHS 85.00',
  },
];

export const FinanceOfficeView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('tariffs');
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(DEMO_SUBMISSIONS);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_SUBMISSIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProofStatus | 'ALL'>('ALL');

  // Review & action state
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmedAmount, setConfirmedAmount] = useState<string>('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Tariffs state
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
  const [newServiceBadge, setNewServiceBadge] = useState('Registry Certified');

  // Receiving accounts state
  const [editingMomo, setEditingMomo] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [momoSettings, setMomoSettings] = useState(PAYMENT_SETTINGS.mobileMoney);
  const [bankSettings, setBankSettings] = useState(PAYMENT_SETTINGS.bankTransfer);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const pendingList = submissions.filter((s) => s.status === 'PENDING');
  const clearedList = submissions.filter((s) => s.status === 'APPROVED');
  const selected = submissions.find((s) => s.id === selectedId) ?? null;

  // Search and filter logic
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter = filterStatus === 'ALL' || sub.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;
    const matchesQuery =
      sub.indexNumber.toLowerCase().includes(q) ||
      sub.applicantName.toLowerCase().includes(q) ||
      sub.senderAccountName.toLowerCase().includes(q) ||
      sub.referenceNumber.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

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
              verifiedBy: 'Mr. Emmanuel Osei (Senior Finance Officer)',
              verifiedAt: 'Just now',
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
              verifiedAt: 'Just now',
            }
          : s
      )
    );
    setShowRejectBox(false);
    setRejectReason('');
  };

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

  return (
    <div className="space-y-6 pb-20">
      
      {/* ── 1. MODERN INSTITUTIONAL HEADER ───────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cug-green-dark via-cug-green to-cug-green-dark p-6 sm:p-7 text-white shadow-xl border border-white/10">
        {/* Subtle patterned backdrop overlay */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-cug-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-inner shrink-0">
              <img src="/cug-logo.png" alt="CUG" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cug-gold/20 border border-cug-gold/40 text-cug-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cug-gold animate-pulse" />
                  Finance Directorate • Fiapre Campus
                </span>
                <span className="text-[11px] text-white/50 hidden sm:inline">• Academic Year 2025/2026</span>
              </div>
              <h1 className="text-display-lg-mobile sm:text-headline-sm font-serif font-bold text-white tracking-tight">
                Academic Revenue &amp; Tariff Management
              </h1>
              <p className="text-white/80 text-body-sm mt-0.5 max-w-2xl leading-relaxed">
                Configure official fees for all document types, manage courier tariffs, and verify student MoMo/bank statement credits.
              </p>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-xl shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-white/70 block">Pending Queue</span>
                <span className="font-mono font-bold text-white text-title-md">
                  {pendingList.length} {pendingList.length === 1 ? 'Request' : 'Requests'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-white/15 text-cug-gold px-2 py-0.5 rounded font-bold ml-2">
              GHS 240.00
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI METRICS STRIP ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Awaiting Verification</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-primary">{pendingList.length}</span>
              <span className="text-[11px] text-amber-800 font-medium">unreconciled</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cug-green/10 border border-cug-green/20 text-cug-green flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Cleared Revenue</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-cug-green">GHS 125.00</span>
              <span className="text-[11px] text-outline">({clearedList.length})</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-surface-container border border-outline-variant/60 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">price_change</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Active Document Tariffs</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-tertiary">{servicesCatalogue.length}</span>
              <span className="text-[11px] text-outline">services listed</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-surface-container border border-outline-variant/60 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">Courier Tariffs</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold text-tertiary">2</span>
              <span className="text-[11px] text-outline">EMS &amp; DHL Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. MODERN SEGMENTED TABS ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-outline-variant/50 pb-1 flex-wrap gap-3">
        <div className="flex gap-1.5 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/40">
          <button
            type="button"
            onClick={() => setActiveTab('tariffs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${
              activeTab === 'tariffs'
                ? 'bg-cug-green text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            <span>Document Prices &amp; Delivery Fees</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('proofs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${
              activeTab === 'proofs'
                ? 'bg-cug-green text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">fact_check</span>
            <span>Payment Clearances</span>
            {pendingList.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'proofs' ? 'bg-amber-300 text-cug-green-deep' : 'bg-amber-100 text-amber-900'
              }`}>
                {pendingList.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-label-md font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-cug-green text-white shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg">account_balance</span>
            <span>Receiving Accounts</span>
          </button>
        </div>

        {/* Global Save Indicator / Action Button */}
        {activeTab === 'tariffs' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetTariffsToDefault}
              className="px-3 py-2 rounded-lg border border-outline-variant text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={() => setShowAddServiceModal(true)}
              className="px-3.5 py-2 rounded-lg bg-surface-container-lowest border border-cug-green/40 text-cug-green font-bold text-[12px] hover:bg-cug-green/5 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Add Document Service</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAllTariffs}
              className="px-5 py-2 rounded-lg bg-cug-green text-white font-bold text-[13px] hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>Save Tariff Schedule</span>
            </button>
          </div>
        )}
      </div>

      {/* ── 4. NOTIFICATION BANNER ───────────────────────────────────────────── */}
      {tariffSavedNotification && (
        <div className="flex items-center justify-between p-4 bg-cug-green/10 border-2 border-cug-green/30 rounded-xl text-cug-green text-body-sm font-semibold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <span>All document prices and courier fees have been updated. The applicant wizard and landing page are synced.</span>
          </div>
          <span className="text-[11px] font-mono uppercase bg-cug-green/20 px-2.5 py-1 rounded text-cug-green font-bold">
            Live Across System
          </span>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: DOCUMENT PRICES & DELIVERY FEES (MANAGED BY FINANCE)         */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tariffs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Academic Document Tariffs (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-title-md font-serif font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">description</span>
                  <span>Academic Document Tariffs</span>
                </h2>
                <p className="text-[12px] text-outline">
                  Adjust unit prices per copy. Subtotals and grand totals recalculate automatically during student checkout.
                </p>
              </div>
              <span className="text-[11px] font-mono text-outline bg-surface-container px-2 py-1 rounded">
                Official Currency: GHS (Ghana Cedis)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {servicesCatalogue.map((service) => {
                const currentPriceGHS = (service.basePricePesewas / 100).toFixed(2);
                return (
                  <div
                    key={service.id}
                    className="group bg-surface-container-lowest border border-outline-variant/70 hover:border-cug-green/60 rounded-xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top row: Code badge & Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-surface-container-low text-primary border border-outline-variant/40">
                          {service.code}
                        </span>
                        {service.badgeText && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cug-gold/20 text-cug-green-dark border border-cug-gold/40">
                            {service.badgeText}
                          </span>
                        )}
                      </div>

                      <h3 className="text-title-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-[12px] text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom row: Editable Price & Delete */}
                    <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-outline block">Official Fee</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-mono font-bold text-primary">GHS</span>
                          <input
                            type="number"
                            step="1.00"
                            min="0"
                            value={currentPriceGHS}
                            onChange={(e) => handleDocumentPriceChange(service.id, e.target.value)}
                            className="w-24 bg-surface-container-low hover:bg-white font-mono font-bold text-body-md text-primary px-2.5 py-1 border border-outline-variant rounded-lg focus:border-cug-green focus:bg-white transition-all text-right shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveService(service.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/5 transition-colors"
                          title="Remove document from schedule"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Courier & Delivery Fees (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-title-md font-serif font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">local_shipping</span>
                <span>Fulfillment &amp; Courier Fees</span>
              </h2>
              <p className="text-[12px] text-outline">
                Fees billed to students depending on their selected fulfillment method.
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              {[
                {
                  method: 'DOMESTIC_COURIER' as DeliveryMethod,
                  title: 'Ghana Post EMS (Domestic)',
                  carrier: 'Ghana Post Limited',
                  desc: 'Nationwide dispatch across all 16 regions',
                  icon: 'local_post_office',
                  fee: deliveryFees.DOMESTIC_COURIER,
                },
                {
                  method: 'INTERNATIONAL_COURIER' as DeliveryMethod,
                  title: 'DHL Express (International)',
                  carrier: 'DHL Aviation Worldwide',
                  desc: 'Fast tracked delivery to overseas addresses',
                  icon: 'flight_takeoff',
                  fee: deliveryFees.INTERNATIONAL_COURIER,
                },
                {
                  method: 'EMAIL' as DeliveryMethod,
                  title: 'Electronic Official PDF',
                  carrier: 'Direct Registrar Email',
                  desc: 'Digitally verified official PDF',
                  icon: 'mark_email_read',
                  fee: deliveryFees.EMAIL,
                },
                {
                  method: 'SELF_PICKUP' as DeliveryMethod,
                  title: 'Self-Pickup (Fiapre Campus)',
                  carrier: 'Academic Affairs Desk',
                  desc: 'In-person collection at registry desk',
                  icon: 'storefront',
                  fee: deliveryFees.SELF_PICKUP,
                },
                {
                  method: 'PROXY_PICKUP' as DeliveryMethod,
                  title: 'Authorized Proxy Pickup',
                  carrier: 'Authorized Representative',
                  desc: 'Designated proxy collection in person',
                  icon: 'group',
                  fee: deliveryFees.PROXY_PICKUP,
                },
              ].map((item) => (
                <div key={item.method} className="space-y-1.5 pb-3.5 border-b border-outline-variant/40 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      <div>
                        <span className="font-bold text-body-sm text-tertiary block leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-outline font-medium block">
                          {item.carrier}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-lg border border-outline-variant/60 shrink-0">
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
                  <p className="text-[11px] text-outline pl-10 leading-tight">{item.desc}</p>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSaveAllTariffs}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-cug-green text-white font-bold text-label-md hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Apply All Tariff Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: STUDENT PAYMENT CLEARANCES & RECONCILIATION                  */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'proofs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column (5 cols): Filterable Request Queue */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search Box */}
            <div className="relative">
              <span className="material-symbols-outlined text-outline absolute left-3 top-2.5 text-lg">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Index No, Student Name, or Ref..."
                className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-sm focus:border-cug-green focus:ring-1 focus:ring-cug-green shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-outline hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center justify-between gap-1 pb-1">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider">Queue:</span>
              <div className="flex gap-1">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilterStatus(f)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      filterStatus === f
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'PENDING' ? `Pending (${pendingList.length})` : f === 'APPROVED' ? 'Cleared' : 'Rejected'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions Cards */}
            <div className="space-y-2.5">
              {filteredSubmissions.length === 0 && (
                <div className="p-8 text-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant text-outline">
                  <span className="material-symbols-outlined text-3xl mb-1">search_off</span>
                  <p className="text-body-sm">No matching student requests found.</p>
                </div>
              )}

              {filteredSubmissions.map((sub) => {
                const isSelected = selectedId === sub.id;
                const initials = sub.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2);

                return (
                  <div
                    key={sub.id}
                    onClick={() => handleSelectSubmission(sub)}
                    className={`bg-surface-container-lowest border rounded-xl p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-cug-green ring-2 ring-cug-green/30 bg-cug-green/[0.03] shadow-sm'
                        : 'border-outline-variant/70 hover:border-cug-green/40 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Student Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cug-green-dark to-cug-green text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-on-surface text-body-sm truncate leading-snug">
                            {sub.applicantName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[11px] font-bold text-primary bg-surface-container-low px-1.5 py-0.2 rounded border border-outline-variant/40">
                              {sub.indexNumber}
                            </span>
                            <span className="text-[10px] text-outline">• {sub.channel.split(' ')[0]}</span>
                          </div>
                          <p className="text-[11px] text-outline truncate mt-0.5">
                            Payer: <strong className="text-tertiary">{sub.senderAccountName}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-primary text-body-md block">
                          {sub.totalExpectedGHS}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1 ${
                          sub.status === 'APPROVED'
                            ? 'bg-cug-green/10 text-cug-green'
                            : sub.status === 'REJECTED'
                            ? 'bg-error/10 text-error'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {sub.status === 'APPROVED' ? 'Cleared' : sub.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                        </span>
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
              <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-5 shadow-xs space-y-4">
                
                {/* 1. Header: Student & Reference Details */}
                <div className="flex items-start justify-between gap-3 border-b border-outline-variant/50 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-title-md font-bold text-primary">
                        {selected.referenceNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selected.status === 'APPROVED'
                          ? 'bg-cug-green/10 text-cug-green'
                          : selected.status === 'REJECTED'
                          ? 'bg-error/10 text-error'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {selected.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-outline font-mono mt-0.5">
                      Submitted: {selected.submittedAt} • {selected.channelDetails}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-body-sm font-medium text-on-surface block">{selected.phone}</span>
                    <span className="text-[11px] text-outline">{selected.programme}</span>
                  </div>
                </div>

                {/* 2. CRITICAL STATEMENT RECONCILIATION MATRIX */}
                <div className="bg-cug-green/5 border-2 border-cug-green/30 rounded-xl p-3.5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cug-green block">
                    Three-Point Statement Verification Matrix
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2.5 text-left bg-white rounded-lg p-2.5 border border-cug-green/20">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-outline block">
                        1. Statement Ref (Index No.)
                      </span>
                      <span className="font-mono font-bold text-sm text-primary block mt-0.5">
                        {selected.indexNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-outline block">
                        2. Name on Account (Sender)
                      </span>
                      <span className="font-bold text-sm text-tertiary truncate block mt-0.5" title={selected.senderAccountName}>
                        {selected.senderAccountName}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-cug-green block">
                        3. Total to Confirm
                      </span>
                      <span className="font-mono font-black text-lg text-cug-green block">
                        {selected.totalExpectedGHS}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. REQUESTED SERVICES BREAKDOWN */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-label-sm font-bold text-primary">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                      <span>Billed Services &amp; Quantities</span>
                    </span>
                    <span className="font-mono text-[11px] text-outline font-normal">
                      Delivery: {selected.deliveryMethod} ({selected.deliveryFeeGHS})
                    </span>
                  </div>

                  <div className="bg-surface-container-low/70 rounded-xl p-3 divide-y divide-outline-variant/40 space-y-1.5 text-body-sm">
                    {selected.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
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
                    <div className="pt-2 flex justify-between font-bold text-[12px] text-on-surface">
                      <span>Total Expected Credit:</span>
                      <span className="font-mono text-primary text-[14px]">{selected.totalExpectedGHS}</span>
                    </div>
                  </div>
                </div>

                {/* 4. PROOF LIGHTBOX THUMBNAIL & ACTION BAR */}
                <div className="pt-2 border-t border-outline-variant/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-lg">receipt_long</span>
                      <span className="text-label-sm font-bold text-primary">Student Payment Receipt:</span>
                      <button
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant text-[11px] font-semibold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        <span>Inspect Receipt Document</span>
                      </button>
                    </div>

                    {selected.status === 'APPROVED' && (
                      <span className="text-cug-green text-[12px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">verified</span>
                        Cleared by {selected.verifiedBy?.split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* Actions when PENDING */}
                  {selected.status === 'PENDING' && (
                    <div className="bg-surface-container-low/40 rounded-xl p-3 border border-outline-variant/60 space-y-2.5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] font-bold text-on-surface">Statement Credit:</label>
                          <span className="font-mono text-xs font-bold text-primary">GHS</span>
                          <input
                            type="number"
                            step="0.01"
                            value={confirmedAmount}
                            onChange={(e) => setConfirmedAmount(e.target.value)}
                            className="w-24 font-mono font-bold text-sm bg-surface-container-lowest border border-outline-variant rounded-lg px-2.5 py-1 text-on-surface focus:border-cug-green"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowRejectBox(!showRejectBox)}
                            className="px-3.5 py-2 rounded-lg border border-error/50 text-error font-semibold text-[11px] hover:bg-error/5 transition-colors"
                          >
                            Flag Discrepancy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprove(selected.id)}
                            className="px-5 py-2 rounded-lg bg-cug-green text-white font-bold text-[12px] hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span>Issue Financial Clearance</span>
                          </button>
                        </div>
                      </div>

                      {showRejectBox && (
                        <div className="pt-2 border-t border-outline-variant/40 space-y-2">
                          <textarea
                            rows={2}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="State exact discrepancy (e.g. Underpayment: received GHS 40.00 on bank slip instead of GHS 85.00)"
                            className="w-full bg-white border border-outline-variant rounded-lg p-2.5 text-xs focus:border-error resize-none"
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
                              className="px-3.5 py-1.5 rounded-lg bg-error text-white font-semibold text-[11px] hover:bg-error-container disabled:opacity-40"
                            >
                              Confirm Rejection &amp; Notify Student
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selected.status === 'APPROVED' && (
                    <div className="bg-cug-green/10 border border-cug-green/20 rounded-xl p-3 text-[12px] text-cug-green flex items-center justify-between">
                      <span>✓ Verified Credit: <strong>{selected.amountReceivedGHS}</strong> against Index Ref <strong>{selected.indexNumber}</strong></span>
                      <span className="font-mono text-[11px] text-outline">{selected.verifiedAt}</span>
                    </div>
                  )}

                  {selected.status === 'REJECTED' && (
                    <div className="bg-error/10 border border-error/20 rounded-xl p-3 text-[12px] text-error space-y-0.5">
                      <p className="font-bold">Rejection Note to Student:</p>
                      <p>{selected.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-2xl flex items-center justify-center h-48 text-center p-4 text-on-surface-variant">
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
        <div className="space-y-6 max-w-4xl">
          {settingsSaved && (
            <div className="flex items-center gap-2 p-3.5 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green font-semibold text-body-sm animate-fade-in">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Payment receiving accounts updated and saved. Students will see these accounts at checkout.
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-title-md font-serif font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">account_balance</span>
                <span>University Receiving Accounts</span>
              </h2>
              <p className="text-[12px] text-outline">
                These receiving accounts are presented to students on the Step 3 Checkout screen.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingMomo(!editingMomo);
                  setEditingBank(!editingBank);
                }}
                className="px-3 py-1.5 rounded-lg border border-outline-variant text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">{editingMomo ? 'close' : 'edit'}</span>
                <span>{editingMomo ? 'Cancel Edit' : 'Edit Accounts'}</span>
              </button>
              {(editingMomo || editingBank) && (
                <button
                  type="button"
                  onClick={handleSaveAccounts}
                  className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-[12px] hover:bg-cug-green-light transition-all flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]">save</span>
                  <span>Save All Accounts</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MoMo Card 1: MTN */}
            <div className="bg-gradient-to-br from-amber-500/15 via-amber-400/5 to-white border-2 border-amber-400/40 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900 text-title-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-700">smartphone</span>
                  MTN Mobile Money
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/30 text-amber-900">
                  Primary MoMo
                </span>
              </div>
              {editingMomo ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Merchant Number</label>
                    <input
                      type="text"
                      value={momoSettings[0]?.accountNumber || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 0 ? { ...n, accountNumber: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Account Name</label>
                    <input
                      type="text"
                      value={momoSettings[0]?.accountName || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 0 ? { ...n, accountName: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Instructions</label>
                    <textarea
                      rows={2}
                      value={momoSettings[0]?.instructions || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 0 ? { ...n, instructions: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-outline block">Merchant Number</span>
                    <span className="font-mono font-bold text-xl text-primary">{momoSettings[0]?.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-outline block">Account Name</span>
                    <span className="font-medium text-body-sm text-on-surface">{momoSettings[0]?.accountName}</span>
                  </div>
                  <p className="text-[11px] text-outline pt-1 border-t border-amber-300/40">
                    Instructions: {momoSettings[0]?.instructions}
                  </p>
                </>
              )}
            </div>

            {/* MoMo Card 2: Telecel */}
            <div className="bg-gradient-to-br from-red-500/15 via-red-400/5 to-white border-2 border-red-400/40 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900 text-title-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-red-700">smartphone</span>
                  Telecel Cash
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-400/30 text-red-900">
                  Secondary MoMo
                </span>
              </div>
              {editingMomo ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Merchant Number</label>
                    <input
                      type="text"
                      value={momoSettings[1]?.accountNumber || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 1 ? { ...n, accountNumber: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Account Name</label>
                    <input
                      type="text"
                      value={momoSettings[1]?.accountName || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 1 ? { ...n, accountName: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-outline block">Instructions</label>
                    <textarea
                      rows={2}
                      value={momoSettings[1]?.instructions || ''}
                      onChange={(e) =>
                        setMomoSettings((prev) =>
                          prev.map((n, i) => (i === 1 ? { ...n, instructions: e.target.value } : n))
                        )
                      }
                      className="w-full bg-white border border-outline-variant rounded px-2.5 py-1 text-xs resize-none"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-outline block">Merchant Number</span>
                    <span className="font-mono font-bold text-xl text-primary">{momoSettings[1]?.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-outline block">Account Name</span>
                    <span className="font-medium text-body-sm text-on-surface">{momoSettings[1]?.accountName}</span>
                  </div>
                  <p className="text-[11px] text-outline pt-1 border-t border-red-300/40">
                    Instructions: {momoSettings[1]?.instructions}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* GCB Bank Card */}
          <div className="bg-gradient-to-br from-cug-green/10 via-cug-green/5 to-white border-2 border-cug-green/30 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cug-green text-title-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-cug-green">account_balance</span>
                {bankSettings.bankName} — Institutional Account
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cug-green/20 text-cug-green">
                Direct Bank Transfer
              </span>
            </div>

            {editingBank ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-outline block">Account Number</label>
                  <input
                    type="text"
                    value={bankSettings.accountNumber}
                    onChange={(e) => setBankSettings((p) => ({ ...p, accountNumber: e.target.value }))}
                    className="w-full bg-white border border-outline-variant rounded px-2 py-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-outline block">Account Name</label>
                  <input
                    type="text"
                    value={bankSettings.accountName}
                    onChange={(e) => setBankSettings((p) => ({ ...p, accountName: e.target.value }))}
                    className="w-full bg-white border border-outline-variant rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-outline block">Branch</label>
                  <input
                    type="text"
                    value={bankSettings.branch}
                    onChange={(e) => setBankSettings((p) => ({ ...p, branch: e.target.value }))}
                    className="w-full bg-white border border-outline-variant rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-outline block">Sort / Swift</label>
                  <input
                    type="text"
                    value={`${bankSettings.sortCode} • ${bankSettings.swiftCode}`}
                    onChange={(e) => {
                      const [sort, swift] = e.target.value.split('•').map((s) => s.trim());
                      setBankSettings((p) => ({ ...p, sortCode: sort || p.sortCode, swiftCode: swift || p.swiftCode }));
                    }}
                    className="w-full bg-white border border-outline-variant rounded px-2 py-1 font-mono"
                  />
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <label className="text-[11px] font-bold text-outline block">Reference Requirement Instructions</label>
                  <input
                    type="text"
                    value={bankSettings.instructions}
                    onChange={(e) => setBankSettings((p) => ({ ...p, instructions: e.target.value }))}
                    className="w-full bg-white border border-outline-variant rounded px-2 py-1"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-body-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">Account Number</span>
                    <span className="font-mono font-bold text-primary">{bankSettings.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">Account Name</span>
                    <span className="font-medium text-on-surface">{bankSettings.accountName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">Branch</span>
                    <span className="font-medium text-on-surface">{bankSettings.branch}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-outline block">Sort / Swift Code</span>
                    <span className="font-mono font-medium text-on-surface">{bankSettings.sortCode} • {bankSettings.swiftCode}</span>
                  </div>
                </div>

                <p className="text-[11px] text-outline pt-1 border-t border-cug-green/20">
                  Reference Requirement: {bankSettings.instructions}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: ADD DOCUMENT SERVICE ───────────────────────────────────────── */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-tertiary/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/80 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <h3 className="font-serif font-bold text-primary text-title-md flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary">add_circle</span>
                <span>Add Academic Document Service</span>
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

      {/* ── MODAL: RECEIPT LIGHTBOX MODAL ─────────────────────────────────────── */}
      {previewModalOpen && selected && (
        <div className="fixed inset-0 z-50 bg-tertiary/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/80 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
              <div>
                <h3 className="font-serif font-bold text-primary text-title-md">
                  Receipt Inspection — {selected.referenceNumber}
                </h3>
                <p className="text-[11px] text-outline">
                  Payer: {selected.senderAccountName} • Ref: {selected.indexNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low p-6 flex flex-col items-center justify-center min-h-[240px] text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cug-green/10 text-cug-green flex items-center justify-center border border-cug-green/20">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <div>
                <p className="font-bold text-tertiary text-body-md">{selected.applicantName}</p>
                <p className="font-mono font-bold text-primary text-lg">{selected.totalExpectedGHS}</p>
                <p className="text-xs text-outline font-mono mt-0.5">{selected.channelDetails}</p>
              </div>
              <p className="text-[11px] text-outline max-w-xs leading-relaxed">
                Official institutional transfer docket. In production, this renders the high-resolution scanned slip or image uploaded by the student.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-primary font-semibold text-xs hover:bg-surface-container-high transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
