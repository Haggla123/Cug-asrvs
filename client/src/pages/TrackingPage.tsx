import React, { useState } from 'react';

interface TrackingPageProps {
  initialRef?: string;
  initialIdentifier?: string;
  onNewRequest: () => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({
  initialRef = '',
  initialIdentifier = '',
  onNewRequest
}) => {
  const [reference, setReference] = useState(initialRef);
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [lookupAttempted, setLookupAttempted] = useState(false);

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();
    setLookupAttempted(true);
  };

  return (
    <section className="w-full max-w-2xl mx-auto space-y-6 pb-24" aria-labelledby="tracking-title">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-secondary text-label-sm font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-sm">timeline</span>
          <span>Request Status</span>
        </div>
        <h1 id="tracking-title" className="text-headline-sm sm:text-headline-md font-serif text-primary tracking-tight font-bold">
          Track an Academic Service Request
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Enter the request reference and the student index number or registered phone number.
        </p>
      </div>

      <form onSubmit={handleLookup} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm space-y-4">
        <div>
          <label htmlFor="tracking-reference" className="block text-label-sm text-on-surface mb-1">Reference Number</label>
          <input id="tracking-reference" required value={reference} onChange={event => setReference(event.target.value)} placeholder="CUG-REQ-YYYY-XXXX" className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary" />
        </div>
        <div>
          <label htmlFor="tracking-identifier" className="block text-label-sm text-on-surface mb-1">Student Index Number or Registered Phone</label>
          <input id="tracking-identifier" required value={identifier} onChange={event => setIdentifier(event.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-body-md font-mono focus:border-primary" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary-container transition-colors">Lookup Status</button>
          <button type="button" onClick={onNewRequest} className="text-label-md font-semibold text-primary hover:underline">Start a new request</button>
        </div>
      </form>

      {lookupAttempted && (
        <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-body-sm text-amber-900">
          Status lookup is unavailable because this application is not connected to the registry API. No record was found or changed. Contact the Registrar through the official university channels for current request status.
        </p>
      )}
    </section>
  );
};
