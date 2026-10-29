# Catholic University of Ghana Academic Services Request & Verification System (CUG ASRVS)

Official web portal and administrative management system for the Catholic University of Ghana (CUG), Fiapre-Sunyani Campus.

---

## 1. System Overview

> **Implementation status:** This repository currently contains a client-side prototype only. The documented Express API, PostgreSQL database, payment processing, registry tracking, verification submission, and authenticated staff services are not implemented in this checkout. Do not use this build to collect payments, submit official requests, or process student records. The client stores applicant drafts in browser `localStorage`.

The intended system is designed to provide these capabilities after the backend is implemented:
1. **Applicant Portal (Zero-Account Required)**: Students and alumni can request multiple official academic credentials (transcripts, English proficiency certifications, introductory letters, certified true copies, recommendations) in a single order with independent copy counters and custom delivery modes.
2. **Instant Settlement & Reference Tracking**: Applicants pay through Ghana Mobile Money (MTN, Telecel, AT) or Visa/Mastercard, receive unique official reference numbers (`CUG-REQ-YYYY-XXXX`), and track processing across all stages.
3. **Staff Processing Workbench**: Role-based departmental queues for Finance clearance, Records preparation, Academic Registrar approval/sealing, and Dispatch fulfillment.
4. **Corporate Academic Verification**: A dedicated pathway for embassies, employers, and foreign evaluation bodies (WES, ECE) to submit candidate verification inquiries.

---

## 2. Design System: Academic Veritas

The visual system adheres strictly to the **Academic Veritas** institutional design tokens:
- **Palette**: Deep University Burgundy (`#4E051A`, `#6B1D2F`), Academic Gold (`#C59B27`, `#FECE57`), Neutral Charcoal/Slate (`#111C2D`, `#1E293B`, `#64748B`), and Clean Surfaces (`#FFFFFF`, `#F8FAFC`, `#F0F3FF`).
- **Typography**: Editorial Collegiate Serif (`Newsreader`) paired with high-legibility Tabular Sans-Serif (`Public Sans`).
- **Components**: Segmented Step Tracker, Independent Tactile Copy Counters (+/- with min 1 floor), Multi-Service Selection Cards, Status Badges, and Verification Seals.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide / Material Symbols Outlined.
- **Backend API**: Node.js, Express, TypeScript, Zod Validation, RESTful Architecture.
- **Database**: PostgreSQL with Prisma ORM (all currency amounts stored as integer pesewas).
- **Testing**: Vitest, Supertest, Playwright.

---

## 4. Repository Structure

```
cug-asrvs/
├── client/                     # React 18 + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable design system UI (Stepper, Counter, Badges, Layout)
│   │   ├── features/           # Domain feature components (Applicant, Services, Orders, Tracking, Staff)
│   │   ├── lib/                # Constants, currency calculations, local draft storage
│   │   ├── pages/              # Landing page, Request wizard, Tracking portal
│   │   └── types/              # Domain TypeScript interfaces
├── server/                     # Express + TypeScript backend (Phase 2+)
├── docs/                       # Architectural & operational documentation
│   ├── requirements.md
│   ├── assumptions.md
│   ├── architecture.md
│   ├── database-design.md
│   ├── api-specification.md
│   ├── security.md
│   ├── testing.md
│   └── deployment.md
├── package.json                # Monorepo root configuration
└── README.md
```

---

## 5. Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install workspace dependencies from the repository root
npm install
```

### Running the Application
```bash
# Start the client development server from the repository root
npm run dev:client
```

### Running Automated Tests
```bash
# Run client unit tests with Vitest
npm test
```

---

## 6. Intended Architecture & Security Requirements (Not Implemented)
- **Decimal-Safe Financial Engine**: All monetary calculations are performed in minor integer currency units (Ghanaian Pesewas: 1 GHS = 100 Pesewas) to prevent floating-point rounding errors.
- **Immutable Snapshots**: Order item prices are snapshotted in the database upon checkout, ensuring future catalogue price revisions never retroactively affect historical transactions.
- **2-Factor Public Tracking**: Public order lookup at `/track` requires both the Reference Number and either the Student Index Number or primary registered mobile phone, shielding confidential student data.
- **Ghanaian Data Protection Compliance (Act 843)**: Minimal data collection, masking of sensitive national ID numbers, and role-based privilege isolation.
