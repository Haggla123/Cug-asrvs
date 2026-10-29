# CUG ASRVS: Testing Strategy & Test Plan

> **Status:** The API and end-to-end cases below are planned. Only the client Vitest unit tests are currently implemented in this checkout.

## 1. Automated Test Hierarchy

```
        ┌──────────────────┐
        │ Playwright (E2E) │ - Complete 3-step applicant checkout & tracking
        └─────────┬────────┘
        ┌─────────┴────────┐
        │ Supertest (API)  │ - Price calc, order creation, idempotent webhooks, RBAC
        └─────────┬────────┘
        ┌─────────┴────────┐
        │  Vitest (Unit)   │ - Money math, copy counters, state machines, Zod validation
        └──────────────────┘
```

## 2. Test Cases Specification

### 2.1 Unit Tests (Vitest)
- **`price-engine.test.ts`**:
  - Test single service calculation (1 × GHS 50 = GHS 50).
  - Test multi-service calculation with independent copy counters (2 × GHS 50 + 1 × GHS 40 = GHS 140).
  - Test delivery surcharges (Pickup = 0, EMS = 50, DHL = 350).
  - Test integer pesewas conversion preventing floating point errors.
- **`state-machine.test.ts`**:
  - Test legal transitions (`SUBMITTED` &rarr; `AWAITING_CLEARANCE` &rarr; `PROCESSING`).
  - Test illegal transitions (`SUBMITTED` &rarr; `COMPLETED` rejected).
  - Test item-level state independence (Transcript = `APPROVED`, English Letter = `PREPARING`).

### 2.2 Integration Tests (Supertest)
- **`webhook-idempotency.test.ts`**:
  - Submit valid webhook: expect `200 OK` and status `PAID`.
  - Re-send exact same webhook: expect `200 OK` and no duplicate record.
  - Submit webhook with invalid signature: expect `401 Unauthorized`.
  - Submit webhook with mismatched payment amount: expect `400 Bad Request`.
- **`tracking-auth.test.ts`**:
  - Valid reference + matching index number &rarr; returns order progress.
  - Valid reference + wrong index number &rarr; returns `404 Not Found`.

### 2.3 End-to-End Tests (Playwright)
- Applicant navigates landing page &rarr; fills Step 1 &rarr; selects multiple services & increments quantities in Step 2 &rarr; reviews price summary in Step 3 &rarr; completes mock payment &rarr; receives tracking reference &rarr; verifies status on `/track`.
