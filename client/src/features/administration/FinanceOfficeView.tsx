import React, { useState } from 'react';
import type { AcademicServiceDefinition, DeliveryMethod, AcademicServiceCode } from '../../types';
import { PAYMENT_SETTINGS } from '../../lib/constants';
import { TariffStorage } from '../../lib/tariffStorage';

// ---------------------------------------------------------------------------
// MODERN FINANCE OFFICE EXECUTIVE WORKSTATION & TARIFF CONTROL PORTAL
// Catholic University of Ghana — Directorate of Finance
// Modeled after contemporary executive fintech dashboard layouts
// ---------------------------------------------------------------------------

type ProofStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type FinanceNavRoute = 'overview' | 'tariffs' | 'clearances' | 'accounts' | 'reports';

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
        details: "Bachelor's Degree • Embossed Seal"
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
        details: "Bachelor's Degree • For Admission"
      }
    ],
    deliveryMethod: 'Ghana Post EMS Domestic Courier (Kumasi)',
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
  const [activeNav, setActiveNav] = useState<FinanceNavRoute>('overview');
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
    <div className="bg-[#111C2D] text-white p-3 sm:p-5 rounded-3xl shadow-2xl border border-white/10 font-sans">
      <div className="flex flex-col lg:flex-row gap-5 min-h-[750px]">
        
        {/* ── 1. MODERN SLEEK DARK SIDEBAR (Matching Reference 1 & 2) ─────────── */}
        <aside className="w-full lg:w-64 bg-[#111C2D] flex flex-col justify-between shrink-0 p-2 lg:p-3">
          <div className="space-y-6">
            
            {/* Brand Header */}
            <div className="flex items-center gap-3 px-2 pt-2">
              <div className="w-10 h-10 rounded-xl bg-cug-gold/20 border border-cug-gold/40 flex items-center justify-center p-1.5 shadow-xs">
                <img src="/cug-logo.png" alt="CUG" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="font-serif font-bold text-white text-base tracking-tight block leading-tight">
                  CUG FINANCE
                </span>
                <span className="text-[10px] text-cug-gold font-mono uppercase tracking-wider block">
                  Directorate of Finance
                </span>
              </div>
            </div>

            {/* Navigation Section 1: MAIN */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-1 block">
                MAIN
              </span>

              {/* Dashboard / Overview */}
              <button
                type="button"
                onClick={() => setActiveNav('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  activeNav === 'overview'
                    ? 'bg-cug-gold text-[#111C2D] shadow-md font-bold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px]">dashboard</span>
                  <span>Dashboard</span>
                </div>
              </button>

              {/* Tariffs & Pricing */}
              <button
                type="button"
                onClick={() => setActiveNav('tariffs')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  activeNav === 'tariffs'
                    ? 'bg-cug-gold text-[#111C2D] shadow-md font-bold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px]">price_change</span>
                  <span>Tariffs &amp; Pricing</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeNav === 'tariffs' ? 'bg-[#111C2D] text-cug-gold' : 'bg-white/10 text-white/70'
                }`}>
                  {servicesCatalogue.length}
                </span>
              </button>

              {/* Payment Clearances */}
              <button
                type="button"
                onClick={() => setActiveNav('clearances')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  activeNav === 'clearances'
                    ? 'bg-cug-gold text-[#111C2D] shadow-md font-bold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px]">verified_user</span>
                  <span>Clearances Queue</span>
                </div>
                {pendingList.length > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    activeNav === 'clearances' ? 'bg-[#111C2D] text-cug-gold' : 'bg-amber-400 text-[#111C2D]'
                  }`}>
                    {pendingList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Navigation Section 2: SETTINGS & RECEIVING */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-1 block">
                MONEY CONTROL
              </span>

              <button
                type="button"
                onClick={() => setActiveNav('accounts')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  activeNav === 'accounts'
                    ? 'bg-cug-gold text-[#111C2D] shadow-md font-bold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px]">account_balance</span>
                  <span>Receiving Accounts</span>
                </div>
                <span className="text-[10px] text-white/40 font-mono">MoMo/Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('reports')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  activeNav === 'reports'
                    ? 'bg-cug-gold text-[#111C2D] shadow-md font-bold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[19px]">analytics</span>
                  <span>Revenue Analytics</span>
                </div>
              </button>
            </div>
          </div>

          {/* User Profile Footer Pill (Matching Reference 1 & 2) */}
          <div className="pt-6 space-y-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cug-green to-cug-gold text-white font-bold text-xs flex items-center justify-center shrink-0">
                  EO
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs truncate">Emmanuel Osei</p>
                  <p className="text-[10px] text-cug-gold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cug-gold" />
                    <span>Senior Finance Officer</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40 px-2 font-mono">
              <span>Fiapre Campus</span>
              <span>v1.2 Live</span>
            </div>
          </div>
        </aside>

        {/* ── 2. MAIN ENCLOSED CANVAS (Pristine Light Theme Container) ─────────── */}
        <main className="flex-1 bg-[#F9FAFB] text-[#111C2D] rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col justify-between overflow-x-hidden">
          <div className="space-y-6">

            {/* Top Workspace Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-primary tracking-tight">
                  {activeNav === 'overview' && 'Executive Finance Dashboard'}
                  {activeNav === 'tariffs' && 'Official Tariff Schedule & Delivery Fees'}
                  {activeNav === 'clearances' && 'Student Payment Clearance Queue'}
                  {activeNav === 'accounts' && 'University Receiving Accounts (MoMo / Bank)'}
                  {activeNav === 'reports' && 'Academic Services Revenue Analytics'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic Services Request &amp; Verification System (ASRVS) • Real-time Financial Ledger
                </p>
              </div>

              {/* Quick Actions & Live Indicator */}
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-cug-green animate-pulse" />
                  <span className="text-slate-600 font-medium">Reconciliation: Active</span>
                </div>

                {activeNav !== 'tariffs' && (
                  <button
                    type="button"
                    onClick={() => setActiveNav('tariffs')}
                    className="px-3.5 py-1.5 rounded-xl bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    <span>Set Tariffs</span>
                  </button>
                )}

                {activeNav === 'tariffs' && (
                  <button
                    type="button"
                    onClick={handleSaveAllTariffs}
                    className="px-4 py-1.5 rounded-xl bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    <span>Save Changes</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── NOTIFICATION ALERT ── */}
            {tariffSavedNotification && (
              <div className="flex items-center justify-between p-3.5 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green text-xs font-semibold animate-fade-in shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Document prices and delivery fees saved successfully! The student checkout wizard is in sync.</span>
                </div>
                <span className="font-mono text-[10px] bg-cug-green/20 px-2 py-0.5 rounded text-cug-green font-bold">
                  ACTIVE
                </span>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* VIEW 1: EXECUTIVE DASHBOARD OVERVIEW (Matching Image 1 & 2)     */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {activeNav === 'overview' && (
              <div className="space-y-6">
                
                {/* Hero Welcome Banner (Modeled after Reference 1 & 2) */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#c8a951] via-[#d4b96a] to-[#c8a951] p-6 text-[#111C2D] shadow-md border border-amber-200/60">
                  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-1.5 bg-white/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#111C2D]">
                        <span>Directorate of Finance Workstation</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
                        Welcome back, Mr. Emmanuel Osei!
                      </h2>
                      <p className="text-xs sm:text-sm text-[#111C2D]/80 leading-relaxed">
                        There are <strong className="font-bold underline">{pendingList.length} student payment transfers</strong> awaiting statement reconciliation. Once cleared, orders move directly to the Academic Records docket.
                      </p>
                      <div className="flex items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveNav('clearances')}
                          className="px-4 py-2 rounded-xl bg-[#111C2D] text-white font-bold text-xs hover:bg-[#1a2b45] active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[15px]">verified_user</span>
                          <span>Reconcile Queue ({pendingList.length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveNav('tariffs')}
                          className="px-3.5 py-2 rounded-xl bg-white/70 hover:bg-white text-[#111C2D] font-bold text-xs transition-all"
                        >
                          <span>Manage Tariff Fees</span>
                        </button>
                      </div>
                    </div>

                    {/* Avatar circle widget from Reference 1 */}
                    <div className="w-20 h-20 rounded-full border-4 border-white/40 bg-white/20 p-1 shrink-0 hidden sm:flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-cug-green to-cug-green-dark text-white font-serif font-bold text-xl flex items-center justify-center shadow-inner">
                        EO
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Quick Stat Pills (Matching Reference 1 & 2) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                      <span className="material-symbols-outlined text-xl">pending</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Queue</span>
                      <span className="font-mono text-lg font-bold text-primary">{pendingList.length}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cug-green/10 text-cug-green flex items-center justify-center shrink-0 border border-cug-green/20">
                      <span className="material-symbols-outlined text-xl">payments</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Cleared Today</span>
                      <span className="font-mono text-lg font-bold text-cug-green">GHS 125.00</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="material-symbols-outlined text-xl">description</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Tariffs</span>
                      <span className="font-mono text-lg font-bold text-slate-800">{servicesCatalogue.length} Documents</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3.5 border border-slate-200/90 shadow-2xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                      <span className="material-symbols-outlined text-xl">speed</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Clearing Time</span>
                      <span className="font-mono text-lg font-bold text-slate-800">1.4 hrs</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Analytics & Live Feeds (Matching Reference 1 & 2) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Revenue Breakdown Donut Chart (7 cols) */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-primary text-base">
                          Academic Services Revenue Share
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Semester 2 Document Request Volume &amp; Tariffs
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-cug-green bg-cug-green/10 px-2 py-0.5 rounded">
                        Total: GHS 128,450.00
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                      {/* SVG CSS Donut Chart */}
                      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Background ring */}
                          <path
                            className="text-slate-100"
                            strokeWidth="4.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment 1: Transcript (48%) - CUG Green */}
                          <path
                            className="text-cug-green"
                            strokeDasharray="48, 100"
                            strokeWidth="4.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment 2: English (22%) - Gold */}
                          <path
                            className="text-[#c8a951]"
                            strokeDasharray="22, 100"
                            strokeDashoffset="-48"
                            strokeWidth="4.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment 3: Attestation (16%) - Blue */}
                          <path
                            className="text-sky-600"
                            strokeDasharray="16, 100"
                            strokeDashoffset="-70"
                            strokeWidth="4.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Segment 4: Other (14%) - Amber */}
                          <path
                            className="text-amber-500"
                            strokeDasharray="14, 100"
                            strokeDashoffset="-86"
                            strokeWidth="4.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="font-mono font-bold text-lg text-primary block leading-none">48%</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Transcript</span>
                        </div>
                      </div>

                      {/* Legend and Progress Breakdown (Modeled after Reference 1) */}
                      <div className="flex-1 w-full space-y-2.5 text-xs">
                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-cug-green" />
                              Official Academic Transcript
                            </span>
                            <span className="font-mono text-slate-800">48% • GHS 61,650</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-cug-green rounded-full" style={{ width: '48%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-[#c8a951]" />
                              English Proficiency Letter
                            </span>
                            <span className="font-mono text-slate-800">22% • GHS 28,250</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-[#c8a951] rounded-full" style={{ width: '22%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-sky-600" />
                              Attestation / Intro Letter
                            </span>
                            <span className="font-mono text-slate-800">16% • GHS 20,550</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-sky-600 rounded-full" style={{ width: '16%' }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              Certified Copy &amp; Recommendation
                            </span>
                            <span className="font-mono text-slate-800">14% • GHS 18,000</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Clearing Activity Feed (5 cols - Modeled after Reference 1 "My Activity") */}
                  <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-primary text-base">
                          Recent Submissions Feed
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Incoming student payment transfers
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveNav('clearances')}
                        className="text-xs text-cug-green hover:underline font-bold"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-3">
                      {submissions.slice(0, 3).map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => {
                            setSelectedId(sub.id);
                            setActiveNav('clearances');
                          }}
                          className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Date Badge like Reference 1 */}
                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0 font-mono shadow-2xs">
                              <span className="text-[9px] uppercase font-bold text-slate-400">OCT</span>
                              <span className="text-xs font-bold text-primary leading-none">30</span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-800 truncate group-hover:text-primary transition-colors">
                                {sub.applicantName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                Ref: {sub.indexNumber} • {sub.channel.split(' ')[0]}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-xs text-primary block">
                              {sub.totalExpectedGHS}
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${
                              sub.status === 'APPROVED' ? 'text-cug-green' : sub.status === 'REJECTED' ? 'text-error' : 'text-amber-800'
                            }`}>
                              {sub.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* VIEW 2: DOCUMENT PRICES & DELIVERY FEES MANAGEMENT               */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {activeNav === 'tariffs' && (
              <div className="space-y-6">
                
                {/* Quick Info & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <div>
                    <h3 className="font-serif font-bold text-primary text-base">
                      Official Registry Catalogue Tariffs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prices configured here automatically update the student checkout wizard and landing page schedule.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetTariffsToDefault}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddServiceModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-cug-green/10 border border-cug-green/30 text-cug-green font-bold text-xs hover:bg-cug-green/20 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      <span>Add Document</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Academic Document Tariffs (8 cols) */}
                  <div className="lg:col-span-8 space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {servicesCatalogue.map((service) => {
                        const currentPriceGHS = (service.basePricePesewas / 100).toFixed(2);
                        return (
                          <div
                            key={service.id}
                            className="bg-white border border-slate-200/90 hover:border-cug-green/60 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                  {service.code}
                                </span>
                                {service.badgeText && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#c8a951]/20 text-[#775a00] border border-[#c8a951]/40">
                                    {service.badgeText}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                {service.title}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                {service.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tariff Fee</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs font-mono font-bold text-primary">GHS</span>
                                  <input
                                    type="number"
                                    step="1.00"
                                    min="0"
                                    value={currentPriceGHS}
                                    onChange={(e) => handleDocumentPriceChange(service.id, e.target.value)}
                                    className="w-24 bg-slate-50 hover:bg-white font-mono font-bold text-sm text-primary px-2.5 py-1 border border-slate-200 rounded-lg focus:border-cug-green focus:bg-white transition-all text-right shadow-inner"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveService(service.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-error hover:bg-error/5 transition-colors"
                                title="Remove document from schedule"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Delivery Fees Rate Card (4 cols) */}
                  <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-serif font-bold text-primary text-base flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary">local_shipping</span>
                        <span>Courier &amp; Delivery Fees</span>
                      </h3>
                      <p className="text-xs text-slate-400">
                        Dispatch charges added at checkout
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        {
                          method: 'DOMESTIC_COURIER' as DeliveryMethod,
                          title: 'Ghana Post EMS (Domestic)',
                          desc: 'Nationwide dispatch to 16 regions',
                          icon: 'local_post_office',
                          fee: deliveryFees.DOMESTIC_COURIER,
                        },
                        {
                          method: 'INTERNATIONAL_COURIER' as DeliveryMethod,
                          title: 'DHL Express (International)',
                          desc: 'Tracked worldwide courier shipping',
                          icon: 'flight_takeoff',
                          fee: deliveryFees.INTERNATIONAL_COURIER,
                        },
                        {
                          method: 'EMAIL' as DeliveryMethod,
                          title: 'Electronic Official PDF',
                          desc: 'Certified PDF emailed to recipient',
                          icon: 'mark_email_read',
                          fee: deliveryFees.EMAIL,
                        },
                        {
                          method: 'SELF_PICKUP' as DeliveryMethod,
                          title: 'Self-Pickup (Fiapre Desk)',
                          desc: 'Academic Affairs Office Desk',
                          icon: 'storefront',
                          fee: deliveryFees.SELF_PICKUP,
                        },
                        {
                          method: 'PROXY_PICKUP' as DeliveryMethod,
                          title: 'Authorized Proxy Pickup',
                          desc: 'Designated representative in person',
                          icon: 'group',
                          fee: deliveryFees.PROXY_PICKUP,
                        },
                      ].map((item) => (
                        <div key={item.method} className="space-y-1 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-secondary">{item.icon}</span>
                              <span>{item.title}</span>
                            </span>

                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                              <span className="text-[10px] font-bold text-primary font-mono">GHS</span>
                              <input
                                type="number"
                                step="1.00"
                                min="0"
                                value={(item.fee / 100).toFixed(2)}
                                onChange={(e) => handleDeliveryFeeChange(item.method, e.target.value)}
                                className="w-16 bg-white font-mono font-bold text-xs text-primary px-1.5 py-0.5 border border-slate-200 rounded focus:border-cug-green text-right"
                              />
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-5">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAllTariffs}
                      className="w-full py-2.5 rounded-xl bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      <span>Apply All Tariff Changes</span>
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* VIEW 3: STUDENT CLEARANCES WORKSTATION                           */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {activeNav === 'clearances' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Left Column: Filterable Submissions Queue (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="relative">
                    <span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-lg">search</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Index No, Student Name, or Ref..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-cug-green focus:ring-1 focus:ring-cug-green shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-1 pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queue:</span>
                    <div className="flex gap-1">
                      {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFilterStatus(f)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                            filterStatus === f
                              ? 'bg-primary text-white border-primary shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {f === 'ALL' ? 'All' : f === 'PENDING' ? `Pending (${pendingList.length})` : f === 'APPROVED' ? `Cleared (${clearedList.length})` : 'Rejected'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {filteredSubmissions.map((sub) => {
                      const isSelected = selectedId === sub.id;
                      const initials = sub.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2);

                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleSelectSubmission(sub)}
                          className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-cug-green ring-2 ring-cug-green/30 bg-cug-green/[0.03] shadow-xs'
                              : 'border-slate-200 hover:border-cug-green/40 hover:shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cug-green to-cug-green-dark text-white font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-xs truncate leading-snug">
                                  {sub.applicantName}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] font-bold text-primary bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                    {sub.indexNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400">• {sub.channel.split(' ')[0]}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                                  Payer: <strong className="text-slate-800">{sub.senderAccountName}</strong>
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-bold text-primary text-xs block">
                                {sub.totalExpectedGHS}
                              </span>
                              <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase mt-1 ${
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

                {/* Right Column: Statement Reconciliation Panel (7 cols) */}
                <div className="lg:col-span-7">
                  {selected ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                      
                      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-bold text-primary">
                              {selected.referenceNumber}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              selected.status === 'APPROVED'
                                ? 'bg-cug-green/10 text-cug-green'
                                : selected.status === 'REJECTED'
                                ? 'bg-error/10 text-error'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {selected.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {selected.submittedAt} • {selected.channelDetails}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-medium text-slate-800 block">{selected.phone}</span>
                          <span className="text-[10px] text-slate-400">{selected.programme}</span>
                        </div>
                      </div>

                      {/* THREE-POINT STATEMENT VERIFICATION MATRIX */}
                      <div className="bg-cug-green/5 border border-cug-green/20 rounded-xl p-3.5 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cug-green block">
                          Reconciliation Verification Matrix
                        </span>
                        
                        <div className="grid grid-cols-3 gap-2.5 text-left bg-white rounded-lg p-2.5 border border-cug-green/15">
                          <div>
                            <span className="text-[9px] font-bold uppercase text-slate-400 block">
                              1. Statement Ref
                            </span>
                            <span className="font-mono font-bold text-xs text-primary block mt-0.5">
                              {selected.indexNumber}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] font-bold uppercase text-slate-400 block">
                              2. Name on Account
                            </span>
                            <span className="font-bold text-xs text-slate-800 truncate block mt-0.5" title={selected.senderAccountName}>
                              {selected.senderAccountName}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[9px] font-bold uppercase text-cug-green block">
                              3. Total to Confirm
                            </span>
                            <span className="font-mono font-black text-sm text-cug-green block">
                              {selected.totalExpectedGHS}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* REQUESTED SERVICES BREAKDOWN */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-primary">
                          <span>Requested Services:</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            Delivery: {selected.deliveryMethod} ({selected.deliveryFeeGHS})
                          </span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-200/60 space-y-1.5 text-xs">
                          {selected.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between pt-1.5 first:pt-0">
                              <div className="min-w-0 pr-2">
                                <span className="font-semibold text-slate-800">{item.title}</span>
                                <span className="text-slate-400 text-[10px] ml-1.5 font-mono">
                                  ({item.quantity}x @ {item.unitPriceGHS})
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-800 shrink-0">
                                {item.subtotalGHS}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 flex justify-between font-bold text-xs text-slate-900">
                            <span>Total Expected Credit:</span>
                            <span className="font-mono text-primary text-sm">{selected.totalExpectedGHS}</span>
                          </div>
                        </div>
                      </div>

                      {/* RECEIPT INSPECTION & ACTIONS */}
                      <div className="pt-2 border-t border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setPreviewModalOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-primary hover:bg-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            <span>Inspect Scanned Receipt</span>
                          </button>

                          {selected.status === 'APPROVED' && (
                            <span className="text-cug-green text-xs font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-base">verified</span>
                              Cleared by {selected.verifiedBy?.split(' ')[0]}
                            </span>
                          )}
                        </div>

                        {selected.status === 'PENDING' && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-700">Statement Credit:</label>
                                <span className="font-mono text-xs font-bold text-primary">GHS</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={confirmedAmount}
                                  onChange={(e) => setConfirmedAmount(e.target.value)}
                                  className="w-24 font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-900 focus:border-cug-green"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowRejectBox(!showRejectBox)}
                                  className="px-3 py-1.5 rounded-lg border border-error/50 text-error font-semibold text-xs hover:bg-error/5 transition-colors"
                                >
                                  Flag Discrepancy
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApprove(selected.id)}
                                  className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-base">check_circle</span>
                                  <span>Issue Financial Clearance</span>
                                </button>
                              </div>
                            </div>

                            {showRejectBox && (
                              <div className="pt-2 border-t border-slate-200 space-y-2">
                                <textarea
                                  rows={2}
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="State exact discrepancy (e.g. Underpayment: received GHS 40.00 on bank slip instead of GHS 85.00)"
                                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:border-error resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setShowRejectBox(false)}
                                    className="text-xs text-slate-500 hover:underline px-2 py-1"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={!rejectReason.trim()}
                                    onClick={() => handleReject(selected.id)}
                                    className="px-3 py-1 rounded-lg bg-error text-white font-semibold text-xs hover:bg-error-container disabled:opacity-40"
                                  >
                                    Confirm Rejection
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {selected.status === 'APPROVED' && (
                          <div className="bg-cug-green/10 border border-cug-green/20 rounded-xl p-3 text-xs text-cug-green flex items-center justify-between">
                            <span>✓ Verified Credit: <strong>{selected.amountReceivedGHS}</strong> against Index Ref <strong>{selected.indexNumber}</strong></span>
                            <span className="font-mono text-[10px] text-slate-500">{selected.verifiedAt}</span>
                          </div>
                        )}

                        {selected.status === 'REJECTED' && (
                          <div className="bg-error/10 border border-error/20 rounded-xl p-3 text-xs text-error space-y-0.5">
                            <p className="font-bold">Rejection Note to Student:</p>
                            <p>{selected.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center h-48 text-center p-4 text-slate-400">
                      <p className="text-xs">Select a request from the left list to review.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* VIEW 4: RECEIVING ACCOUNTS (MOMO & BANK)                         */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {activeNav === 'accounts' && (
              <div className="space-y-6">
                {settingsSaved && (
                  <div className="flex items-center gap-2 p-3 bg-cug-green/10 border border-cug-green/30 rounded-xl text-cug-green font-semibold text-xs animate-fade-in shadow-2xs">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Payment receiving accounts updated and saved. Students will see these accounts at checkout.
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-serif font-bold text-primary text-base">
                      University Receiving Accounts (Checkout Settings)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage official mobile money merchant lines and bank details displayed to applicants.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMomo(!editingMomo);
                        setEditingBank(!editingBank);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">{editingMomo ? 'close' : 'edit'}</span>
                      <span>{editingMomo ? 'Cancel Edit' : 'Edit Accounts'}</span>
                    </button>
                    {(editingMomo || editingBank) && (
                      <button
                        type="button"
                        onClick={handleSaveAccounts}
                        className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">save</span>
                        <span>Save All Accounts</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* MoMo Card 1: MTN */}
                  <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white border border-amber-300 rounded-2xl p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-700">smartphone</span>
                        MTN Mobile Money
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/30 text-amber-900">
                        Primary MoMo
                      </span>
                    </div>
                    {editingMomo ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Merchant Number</label>
                          <input
                            type="text"
                            value={momoSettings[0]?.accountNumber || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 0 ? { ...n, accountNumber: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Account Name</label>
                          <input
                            type="text"
                            value={momoSettings[0]?.accountName || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 0 ? { ...n, accountName: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Instructions</label>
                          <textarea
                            rows={2}
                            value={momoSettings[0]?.instructions || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 0 ? { ...n, instructions: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant Number</span>
                          <span className="font-mono font-bold text-lg text-primary">{momoSettings[0]?.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Name</span>
                          <span className="font-medium text-xs text-slate-800">{momoSettings[0]?.accountName}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 pt-1 border-t border-amber-200">
                          Instructions: {momoSettings[0]?.instructions}
                        </p>
                      </>
                    )}
                  </div>

                  {/* MoMo Card 2: Telecel */}
                  <div className="bg-gradient-to-br from-red-500/10 via-red-400/5 to-white border border-red-300 rounded-2xl p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-900 text-sm flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-red-700">smartphone</span>
                        Telecel Cash
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-400/30 text-red-900">
                        Secondary MoMo
                      </span>
                    </div>
                    {editingMomo ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Merchant Number</label>
                          <input
                            type="text"
                            value={momoSettings[1]?.accountNumber || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 1 ? { ...n, accountNumber: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Account Name</label>
                          <input
                            type="text"
                            value={momoSettings[1]?.accountName || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 1 ? { ...n, accountName: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">Instructions</label>
                          <textarea
                            rows={2}
                            value={momoSettings[1]?.instructions || ''}
                            onChange={(e) =>
                              setMomoSettings((prev) =>
                                prev.map((n, i) => (i === 1 ? { ...n, instructions: e.target.value } : n))
                              )
                            }
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Merchant Number</span>
                          <span className="font-mono font-bold text-lg text-primary">{momoSettings[1]?.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Name</span>
                          <span className="font-medium text-xs text-slate-800">{momoSettings[1]?.accountName}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 pt-1 border-t border-red-200">
                          Instructions: {momoSettings[1]?.instructions}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* GCB Bank Card */}
                <div className="bg-gradient-to-br from-cug-green/10 via-cug-green/5 to-white border border-cug-green/30 rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cug-green text-sm flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-cug-green">account_balance</span>
                      {bankSettings.bankName} — Institutional Account
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cug-green/20 text-cug-green">
                      Direct Bank Transfer
                    </span>
                  </div>

                  {editingBank ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">Account Number</label>
                        <input
                          type="text"
                          value={bankSettings.accountNumber}
                          onChange={(e) => setBankSettings((p) => ({ ...p, accountNumber: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">Account Name</label>
                        <input
                          type="text"
                          value={bankSettings.accountName}
                          onChange={(e) => setBankSettings((p) => ({ ...p, accountName: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">Branch</label>
                        <input
                          type="text"
                          value={bankSettings.branch}
                          onChange={(e) => setBankSettings((p) => ({ ...p, branch: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block">Sort / Swift</label>
                        <input
                          type="text"
                          value={`${bankSettings.sortCode} • ${bankSettings.swiftCode}`}
                          onChange={(e) => {
                            const [sort, swift] = e.target.value.split('•').map((s) => s.trim());
                            setBankSettings((p) => ({ ...p, sortCode: sort || p.sortCode, swiftCode: swift || p.swiftCode }));
                          }}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 font-mono"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-4">
                        <label className="text-[10px] font-bold text-slate-500 block">Reference Requirement Instructions</label>
                        <input
                          type="text"
                          value={bankSettings.instructions}
                          onChange={(e) => setBankSettings((p) => ({ ...p, instructions: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Number</span>
                          <span className="font-mono font-bold text-primary">{bankSettings.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Name</span>
                          <span className="font-medium text-slate-800">{bankSettings.accountName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Branch</span>
                          <span className="font-medium text-slate-800">{bankSettings.branch}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Sort / Swift</span>
                          <span className="font-mono font-medium text-slate-800">{bankSettings.sortCode} • {bankSettings.swiftCode}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500 pt-1 border-t border-cug-green/20">
                        Reference Requirement: {bankSettings.instructions}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* VIEW 5: REVENUE ANALYTICS & AUDIT LEDGER                         */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {activeNav === 'reports' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-primary text-base">
                      Institutional Audit &amp; Settlement Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Approved document transactions cleared into university bank &amp; MoMo accounts.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-cug-green bg-cug-green/10 px-2.5 py-1 rounded">
                    Audit Certified
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">{sub.referenceNumber}</span>
                          <span className="font-bold text-slate-800">{sub.applicantName}</span>
                          <span className="text-slate-400 font-mono">({sub.indexNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {sub.channelDetails} • {sub.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 block">{sub.totalExpectedGHS}</span>
                        <span className={`text-[10px] font-bold uppercase ${
                          sub.status === 'APPROVED' ? 'text-cug-green' : sub.status === 'REJECTED' ? 'text-error' : 'text-amber-700'
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer of the white canvas */}
          <div className="pt-6 mt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>Catholic University of Ghana • Directorate of Finance Institutional Portal</span>
            <span className="font-mono">Bank of Ghana / Data Protection Act 843 Compliant</span>
          </div>
        </main>

      </div>

      {/* ── MODAL: ADD DOCUMENT SERVICE ───────────────────────────────────────── */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-[#111C2D]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in text-[#111C2D]">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-primary text-base flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary">add_circle</span>
                <span>Add Academic Document Service</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddServiceModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleAddNewService} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="e.g. Visa Attestation Letter"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-cug-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Document Code
                  </label>
                  <select
                    value={newServiceCode}
                    onChange={(e) => setNewServiceCode(e.target.value as AcademicServiceCode)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-mono text-xs focus:border-cug-green"
                  >
                    <option value="TRANSCRIPT">TRANSCRIPT</option>
                    <option value="ENGLISH_PROFICIENCY">ENGLISH_PROFICIENCY</option>
                    <option value="ATTESTATION">ATTESTATION</option>
                    <option value="CERTIFIED_COPY">CERTIFIED_COPY</option>
                    <option value="RECOMMENDATION">RECOMMENDATION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Price (GHS) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={newServicePriceGHS}
                    onChange={(e) => setNewServicePriceGHS(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono font-bold text-slate-900 focus:border-cug-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={newServiceBadge}
                  onChange={(e) => setNewServiceBadge(e.target.value)}
                  placeholder="e.g. Seal Included, Express"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-cug-green text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Official Description
                </label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Brief registry description of the certified document..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:border-cug-green text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cug-green text-white font-bold text-xs hover:bg-cug-green-light"
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
        <div className="fixed inset-0 z-50 bg-[#111C2D]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-[#111C2D]">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-primary text-base">
                  Receipt Inspection — {selected.referenceNumber}
                </h3>
                <p className="text-[10px] text-slate-400">
                  Payer: {selected.senderAccountName} • Ref: {selected.indexNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[220px] text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cug-green/10 text-cug-green flex items-center justify-center border border-cug-green/20">
                <span className="material-symbols-outlined text-3xl">receipt_long</span>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-xs">{selected.applicantName}</p>
                <p className="font-mono font-bold text-primary text-base">{selected.totalExpectedGHS}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selected.channelDetails}</p>
              </div>
              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                Scanned transfer docket. In production, this renders the direct screenshot or PDF slip uploaded by the applicant.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
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
