# CUG ASRVS: Architecture & Technical Design

## 1. System Architecture Overview

CUG ASRVS follows a clean, modular monorepo architecture separating the public and staff frontend (`client`), the RESTful backend API (`server`), and system documentation (`docs`).

```
                    ┌───────────────────────────┐
                    │  Applicant / Public User  │
                    │   (Mobile/Desktop Web)    │
                    └─────────────┬─────────────┘
                                  │ HTTPS
                                  ▼
                    ┌───────────────────────────┐
                    │ React + Tailwind Frontend │
                    │     (Academic Veritas)    │
                    └─────────────┬─────────────┘
                                  │ JSON REST
                                  ▼
                    ┌───────────────────────────┐
                    │ Express TypeScript Server │
                    │ (Zod Validation, RBAC,    │
                    │  Price Engine, Webhooks)  │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │ Payment Adapters │    │ Notification Svc │
│  (Prisma ORM)    │    │ (Mock, Paystack, │    │  (Mock, Email,   │
│                  │    │      Hubtel)     │    │       SMS)       │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## 2. Monorepo Organization
- **`client/`**: Vite + React 18 + TypeScript + Tailwind CSS.
  - Implements the **Academic Veritas** institutional design system (`stitch_cug_academic_services_system/academic_veritas/DESIGN.md`).
  - Strict 3-step applicant wizard.
  - Public tracking portal (`/track`).
  - Third-party academic verification portal (`/verify`).
  - Staff management portal for role-based processing.
- **`server/`**: Node.js + Express + TypeScript + Prisma ORM.
  - Modular directory layout by domain bounded contexts.
  - Zod schemas for request validation.
  - Decimal-safe money representation (integer pesewas: 100 pesewas = GHS 1.00).
  - Provider-agnostic payment and notification adapters.

## 3. Key Design Decisions

### Decimal-Safe Pricing
Monetary values are never stored or computed as floating-point numbers. All database columns and API contracts express values in integer minor currency units (`pesewas`).

### Price Snapshotting
When an order is created, an immutable snapshot of each item's unit price, quantity, and delivery fee is recorded. Any future adjustments to the service catalogue will never alter existing orders.

### Idempotency & Webhook Safety
Payment webhooks verify gateway signatures (HMAC SHA-512) and record raw events with unique constraints on `(provider, event_id)`. Orders can only transition from `PENDING` to `PAID` once inside an ACID database transaction.
