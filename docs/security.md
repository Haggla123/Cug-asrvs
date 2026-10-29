# CUG ASRVS: Security & Data Protection Specification

## 1. Threat Modeling & Countermeasures

### 1.1 Insecure Direct Object References (IDOR) on Tracking
- **Risk**: Attackers enumerate reference numbers (`CUG-REQ-2026-0001`, `0002`) to view applicant identities and addresses.
- **Countermeasure**: The tracking endpoint requires two distinct factors: the reference number AND either the student's registered index number or primary mobile phone number. Responses scrub all internal notes, raw payment identifiers, and document binaries.

### 1.2 Price Tampering & Subtotal Manipulation
- **Risk**: Malicious clients modify HTTP payloads to purchase services at 0 GHS.
- **Countermeasure**: Client-provided monetary calculations are completely ignored. The backend price calculation engine independently evaluates all prices from the database snapshot and initiates the gateway transaction with server-calculated amounts.

### 1.3 Webhook Forgery & Replay Attacks
- **Risk**: Fake payment success events sent to trigger unauthorized document processing.
- **Countermeasure**:
  1. Cryptographic HMAC-SHA512 verification of incoming gateway signatures against the secret key.
  2. Gateway IP whitelist verification where applicable.
  3. Unique constraint enforcement on `(provider, event_id)` preventing event replay.
  4. Database row locking during finalization transactions.

### 1.4 Arbitrary File Uploads
- **Risk**: Upload of executable scripts disguised as certified certificate copies.
- **Countermeasure**:
  1. Strict MIME type verification checking file headers (magic bytes), restricted to `application/pdf`, `image/jpeg`, and `image/png`.
  2. Maximum size ceiling of 5MB.
  3. Storage in private non-executable directories with randomly generated UUID filenames.
  4. Access via authenticated proxy with streaming and Content-Disposition headers.

## 2. Data Minimization & Privacy
In alignment with the Data Protection Act of Ghana (Act 843):
- Student academic records are fetched on-demand and not duplicated unnecessarily.
- National ID numbers (Ghana Card) for authorized proxies are made optional and masked in staff views.
- Audit logs capture actor, action, timestamp, and entity ID while redacting passwords, session tokens, and personal credentials.
