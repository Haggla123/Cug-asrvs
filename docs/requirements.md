# Catholic University of Ghana Academic Services Request & Verification System (CUG ASRVS)

## Functional Requirements Specification

### 1. Overview
The Catholic University of Ghana Academic Services Request & Verification System (CUG ASRVS) provides an institutional gateway for current students, alumni, and external organizations to request, pay for, track, and verify official academic credentials and services.

### 2. Requirements Maturity Classification

#### Category A: Required Product Behavior
- **No-Login Applicant Workflow**: Applicants submit requests without needing account registration or prior password setup.
- **Three-Step Request Wizard**:
  - Step 1: Student Information & Academic Status verification input.
  - Step 2: Multi-service catalogue selection, independent copy counters, recipient specification, and delivery method configuration.
  - Step 3: Order review, itemized price breakdown, and secure payment initiation.
- **Multi-Service Ordering**: Single order containing multiple distinct academic services (e.g. Transcript + English Proficiency Letter + Attestation).
- **Independent Copy Counters**: Each selected service has its own dedicated counter starting at 1, incrementable/decrementable, updating subtotals immediately.
- **Recipient & Delivery Modes**: Support for self-pickup, authorized proxy pickup, electronic email delivery, domestic courier (Ghana Post EMS), and international courier (DHL Express).
- **Decimal-Safe Financial Engine**: Server-side calculations stored as integer minor currency units (Ghanaian Pesewas: 1 GHS = 100 Pesewas).
- **Provider-Independent Payment Abstraction**: Support for Mobile Money (MTN, Telecel, AT) and Card checkout via idempotent webhook reconciliation.
- **Request Reference Generation**: Unique human-readable references formatted as `CUG-REQ-YYYY-XXXX` with database collision handling.
- **Public Reference Tracking**: Rate-limited 2-factor status inquiry at `/track` requiring Reference Number + (Index Number OR Phone).
- **Staff Processing Queues**: Role-specific workflows for Finance Officers, Records Officers, Academic Registrar, and Dispatch Officers.
- **Independent Item-Level Statuses**: Each service item maintains its own preparation, review, and fulfillment state alongside overall order state.

#### Category B: Proposed Business Configuration (Defaults to be Approved by CUG)
- Service Prices:
  - Official Academic Transcript: GHS 50.00
  - English Proficiency Letter: GHS 40.00
  - Attestation / Introductory Letter: GHS 35.00
  - Certified True Copy of Certificate: GHS 30.00
  - Academic Recommendation Letter: GHS 40.00
- Courier Fees:
  - Domestic (Ghana Post EMS): GHS 50.00
  - International (DHL Express): GHS 350.00
- Pickup Location: Academic Affairs Office Desk, Fiapre-Sunyani Campus.
- Faculties and Programmes catalogue.
- Staff role permissions and document signing protocols.

#### Category C: External Integrations (Requiring Institutional Credentials)
- CUG Student Information System (SIS/CUMIS).
- Live Payment Gateways (Paystack, Hubtel).
- SMS Gateway (Hubtel, Arkesel).
- Transactional SMTP Email Provider.
- Digital Signature Infrastructure (PKI / HSM).
