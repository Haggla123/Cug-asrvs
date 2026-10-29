# CUG ASRVS: REST API Specification

> **Status:** Proposed API contract only. No server implementation or live endpoint exists in this repository.

Version: `v1`  
Base URL: `/api/v1`

## 1. Public Applicant Endpoints

### `GET /api/v1/services`
Retrieves all active academic services, current prices in pesewas, and configuration metadata.
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "srv_transcript",
      "code": "TRANSCRIPT",
      "title": "Official Academic Transcript",
      "unitPricePesewas": 5000,
      "requiresLevel": true,
      "requiresDocument": false
    }
  ]
}
```

### `POST /api/v1/orders/calculate`
Authoritative server price calculation. Client supplies services, quantities, and delivery method; server computes and returns itemized breakdown and total.
- **Request Body**:
```json
{
  "items": [
    { "serviceId": "srv_transcript", "quantity": 2, "options": { "academicLevel": "BACHELORS" } },
    { "serviceId": "srv_english", "quantity": 1 }
  ],
  "deliveryMethod": "DOMESTIC_COURIER"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "items": [
      { "serviceId": "srv_transcript", "quantity": 2, "unitPricePesewas": 5000, "subtotalPesewas": 10000 },
      { "serviceId": "srv_english", "quantity": 1, "unitPricePesewas": 4000, "subtotalPesewas": 4000 }
    ],
    "subtotalPesewas": 14000,
    "deliveryFeePesewas": 5000,
    "totalPesewas": 19000
  }
}
```

### `POST /api/v1/orders`
Creates a pending order and initiates payment attempt.
- **Request Body**: Full student information, selected items, recipient configuration, delivery details, and chosen payment method.
- **Response**: `201 Created` with checkout URL / payment authorization token.

### `POST /api/v1/payments/webhook/:provider`
Idempotent payment webhook endpoint verifying gateway signatures and advancing order status to `PAID` upon transaction settlement.

### `GET /api/v1/tracking`
Public status lookup endpoint.
- **Query Parameters**:
  - `ref`: Order reference number (e.g. `CUG-REQ-2026-8941`)
  - `identifier`: Student Index Number OR Phone Number
- **Response**: `200 OK` with sanitized tracking timeline and per-item statuses.

---

## 2. Staff Management Endpoints (Authenticated)

- `POST /api/v1/staff/auth/login`: Staff authentication, returns JWT and user permissions.
- `GET /api/v1/staff/clearance/queue`: Finance clearance queue.
- `POST /api/v1/staff/clearance/:orderId/decision`: Submit financial clearance verdict.
- `GET /api/v1/staff/records/queue`: Records office preparation queue.
- `POST /api/v1/staff/records/items/:itemId/draft`: Upload prepared document draft.
- `POST /api/v1/staff/records/items/:itemId/submit`: Submit item to Academic Registrar.
- `GET /api/v1/staff/approvals/queue`: Registrar approval queue.
- `POST /api/v1/staff/approvals/items/:itemId/sign`: Approve, seal, and sign item.
- `GET /api/v1/staff/dispatch/queue`: Dispatch and collection queue.
- `POST /api/v1/staff/dispatch/items/:itemId/fulfill`: Record tracking code or proxy collection.
