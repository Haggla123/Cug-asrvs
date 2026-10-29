import React, { useState } from 'react';

export const VerificationView: React.FC = () => {
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    requesterName: '',
    requesterEmail: '',
    studentName: '',
    studentIndex: '',
    programme: '',
    graduationYear: '',
    verificationPurpose: 'Employment Background Check'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionAttempted(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-24">
      <section className="space-y-2">
        <div className="flex items-center gap-3.5">
          <img 
            src="/cug-logo.png" 
            alt="Catholic University Crest" 
            className="w-12 h-12 object-contain drop-shadow-xs shrink-0" 
          />
          <div>
            <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-label-sm font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>External Institutional Gateway</span>
            </div>
            <h1 className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold leading-tight">
              Academic Verification Portal
            </h1>
          </div>
        </div>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Employers, embassies, and educational institutions can submit requests to verify academic credentials, degrees, and transcripts issued by Catholic University of Ghana.
        </p>
      </section>

      <>
        {submissionAttempted && (
          <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-body-sm text-amber-900">
            Verification submission is unavailable because this application has no registry API or secure consent upload service. No request or reference number was created. Please contact the Registrar through official university channels.
          </p>
        )}
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm space-y-5">
          <div className="border-b border-outline-variant/50 pb-3">
            <h2 className="text-title-md font-title-md text-primary font-bold">
              Requester &amp; Candidate Information
            </h2>
            <p className="text-body-sm text-outline">
              All academic verifications require candidate authorization consent
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                Organization / Company Name <span className="text-primary font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
                placeholder="e.g. KPMG Ghana, US Embassy"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                Authorized Officer Email <span className="text-primary font-bold">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.requesterEmail}
                onChange={e => setFormData({ ...formData, requesterEmail: e.target.value })}
                placeholder="officer@company.com"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                Graduate / Student Full Name <span className="text-primary font-bold">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Name as registered at CUG"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                Student Index Number (If available)
              </label>
              <input
                type="text"
                value={formData.studentIndex}
                onChange={e => setFormData({ ...formData, studentIndex: e.target.value })}
                placeholder="e.g. CUG/BIT/20/004"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-label-sm font-label-sm text-on-surface mb-1">
                Upload Candidate Signed Consent / Authorization Form <span className="text-primary font-bold">*</span>
              </label>
              <input
                type="file"
                required
                accept=".pdf,.png,.jpg"
                className="text-body-sm text-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-label-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container cursor-pointer"
              />
              <p className="text-[11px] text-outline mt-1">
                Required under the Data Protection Act to release candidate academic status
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-lg bg-primary text-white font-semibold text-title-sm hover:bg-primary-container transition-all flex items-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-lg">verified</span>
              <span>Submit Verification Request</span>
            </button>
          </div>
        </form>
      </>
    </div>
  );
};
