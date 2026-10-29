import React, { useState } from 'react';

type StaffRole = 'FINANCE' | 'RECORDS' | 'REGISTRAR' | 'DISPATCH';

export const StaffDemoView: React.FC = () => {
  const [activeRole, setActiveRole] = useState<StaffRole>('FINANCE');
  const [clearedOrders, setClearedOrders] = useState<Record<string, boolean>>({});
  const [preparedItems, setPreparedItems] = useState<Record<string, boolean>>({});
  const [approvedItems, setApprovedItems] = useState<Record<string, boolean>>({});
  const [dispatchedItems, setDispatchedItems] = useState<Record<string, string>>({});

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <section className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          <span>Institutional Staff Processing Gateway</span>
        </div>
        <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          CUG Academic Services Staff Portal
        </h1>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Simulated desktop operational workbench for authorized university officers. Each role operates within strict departmental boundaries.
        </p>
      </section>

      {/* Role Navigation Bar */}
      <div className="bg-surface-container-low p-1.5 rounded-xl flex flex-wrap items-center gap-1 border border-outline-variant/60 shadow-xs">
        {[
          { role: 'FINANCE' as const, label: 'Finance Clearance', icon: 'account_balance_wallet', count: '1 Pending' },
          { role: 'RECORDS' as const, label: 'Records Preparation', icon: 'history_edu', count: '2 Pending' },
          { role: 'REGISTRAR' as const, label: 'Academic Registrar', icon: 'verified', count: '1 Pending' },
          { role: 'DISPATCH' as const, label: 'Dispatch & Collection', icon: 'local_shipping', count: '1 Ready' }
        ].map((tab) => (
          <button
            key={tab.role}
            type="button"
            onClick={() => setActiveRole(tab.role)}
            className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-label-md font-label-md flex items-center justify-center gap-2 transition-all font-semibold ${
              activeRole === tab.role
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* QUEUE 1: FINANCE OFFICER */}
      {activeRole === 'FINANCE' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
            <div>
              <h2 className="text-title-md font-bold text-primary">
                Paid Requests Awaiting Financial Clearance
              </h2>
              <p className="text-body-sm text-outline">
                Verify student fee arrears in CUMIS manual records before clearing request for preparation
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-label-sm font-semibold">
              Queue: 1 Request
            </span>
          </div>

          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-label-sm text-outline font-mono block">CUG-REQ-2026-8941</span>
                <span className="text-title-sm font-bold text-tertiary">Mensah, Kwame Emmanuel</span>
                <span className="text-body-sm text-on-surface-variant block font-mono">
                  Index: CUG/BIT/20/004 • BSc. Information Technology
                </span>
              </div>
              <div className="text-right">
                <span className="text-title-sm font-mono font-bold text-primary block">GHS 140.00 Paid</span>
                <span className="text-[11px] text-emerald-700 font-semibold">Payment Confirmed via MoMo</span>
              </div>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg text-body-sm border border-outline-variant/40 flex items-center justify-between">
              <div>
                <span className="font-semibold text-tertiary">Fee Arrears Assessment:</span>
                <span className="text-emerald-700 font-medium ml-2">No Outstanding Arrears (CUG SIS Verified)</span>
              </div>
              <span className="text-label-sm text-outline">Audited by: Fiapre Finance Desk</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded border border-rose-300 text-rose-700 hover:bg-rose-50 text-label-sm font-semibold"
              >
                Flag Arrears
              </button>
              <button
                type="button"
                onClick={() => setClearedOrders({ ...clearedOrders, '8941': true })}
                disabled={clearedOrders['8941']}
                className="px-5 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 text-label-md font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>{clearedOrders['8941'] ? 'Clearance Granted' : 'Clear Finance & Route to Records'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 2: RECORDS OFFICER */}
      {activeRole === 'RECORDS' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
            <div>
              <h2 className="text-title-md font-bold text-primary">
                Records Preparation Queue
              </h2>
              <p className="text-body-sm text-outline">
                Eligible orders with cleared finances awaiting document drafting and registry transcription
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200 text-label-sm font-semibold">
              Queue: 2 Service Items
            </span>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-label-sm text-outline">ITEM-001 • CUG-REQ-2026-8941</span>
                  <h3 className="text-title-sm font-bold text-tertiary">Official Academic Transcript (2 Copies)</h3>
                  <p className="text-body-sm text-outline">Bachelor's Degree • Alumnus 2023</p>
                </div>
                <span className="px-2 py-0.5 rounded text-label-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  Finance Cleared
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                <span className="text-body-sm text-outline">Draft PDF: Transcript_Mensah_Draft.pdf</span>
                <button
                  type="button"
                  onClick={() => setPreparedItems({ ...preparedItems, 'transcript': true })}
                  disabled={preparedItems['transcript']}
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary-container disabled:opacity-50"
                >
                  {preparedItems['transcript'] ? '✓ Submitted to Registrar' : 'Submit for Registrar Approval'}
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-label-sm text-outline">ITEM-002 • CUG-REQ-2026-8941</span>
                  <h3 className="text-title-sm font-bold text-tertiary">English Proficiency Letter (1 Copy)</h3>
                  <p className="text-body-sm text-outline">Medium of Instruction Certification</p>
                </div>
                <span className="px-2 py-0.5 rounded text-label-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  Finance Cleared
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-outline-variant/40">
                <span className="text-body-sm text-outline">Template: Std_English_Proficiency_2026.docx</span>
                <button
                  type="button"
                  onClick={() => setPreparedItems({ ...preparedItems, 'english': true })}
                  disabled={preparedItems['english']}
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-label-sm font-semibold hover:bg-primary-container disabled:opacity-50"
                >
                  {preparedItems['english'] ? '✓ Submitted to Registrar' : 'Submit for Registrar Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 3: ACADEMIC REGISTRAR */}
      {activeRole === 'REGISTRAR' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
            <div>
              <h2 className="text-title-md font-bold text-primary">
                Executive Review &amp; Official Sealing
              </h2>
              <p className="text-body-sm text-outline">
                Academic Registrar workbench to preview prepared credentials, apply official seal, and authorize issuance
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 text-label-sm font-semibold">
              Pending Signature: 1
            </span>
          </div>

          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-label-sm text-outline">DOCKET: CUG-REQ-2026-8941</span>
                <h3 className="text-title-sm font-bold text-tertiary">
                  Transcript: Emmanuel Kwabena Mensah (CUG/BIT/20/004)
                </h3>
                <p className="text-body-sm text-outline">
                  Prepared by: Academic Registry Archive Officer • Cumulative GPA: 3.72
                </p>
              </div>
              <span className="text-label-sm text-secondary font-bold">Awaiting Seal</span>
            </div>

            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-body-sm">
                <span className="material-symbols-outlined text-primary">description</span>
                <span className="font-mono text-tertiary">CUG_Official_Transcript_Mensah_Verified.pdf</span>
              </div>
              <button type="button" className="text-label-sm font-semibold text-primary hover:underline">
                Preview Document
              </button>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container text-label-sm font-semibold"
              >
                Return for Revision
              </button>
              <button
                type="button"
                onClick={() => setApprovedItems({ ...approvedItems, 'mensah': true })}
                disabled={approvedItems['mensah']}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-container disabled:opacity-50 text-label-md font-semibold flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>{approvedItems['mensah'] ? '✓ Sealed &amp; Approved' : 'Affix Official Seal &amp; Sign'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUEUE 4: DISPATCH OFFICER */}
      {activeRole === 'DISPATCH' && (
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/80 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-outline-variant/50 pb-3">
            <div>
              <h2 className="text-title-md font-bold text-primary">
                Fulfillment &amp; Dispatch Queue
              </h2>
              <p className="text-body-sm text-outline">
                Record courier waybill tracking numbers, verify campus collection desk pickups, and finalize dockets
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-label-sm font-semibold">
              Ready for Dispatch: 1
            </span>
          </div>

          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-label-sm text-outline">DOCKET: CUG-REQ-2026-8941</span>
                <h3 className="text-title-sm font-bold text-tertiary">
                  Ghana Post EMS Domestic Courier
                </h3>
                <p className="text-body-sm text-outline">
                  Destination: Ghana Audit Service, Accra Central Dispatch
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-label-sm bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Registrar Approved
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="Enter EMS Waybill Code (e.g. EMS-GH-2026-991)"
                value={dispatchedItems['8941'] || ''}
                onChange={e => setDispatchedItems({ ...dispatchedItems, '8941': e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono"
              />
              <button
                type="button"
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-emerald-700 text-white font-semibold text-label-md hover:bg-emerald-800 shrink-0 shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">send</span>
                <span>Confirm Dispatch &amp; Notify</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
