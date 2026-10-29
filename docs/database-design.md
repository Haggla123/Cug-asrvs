# CUG ASRVS: Database Design Specification

## 1. Design Principles
1. **Third Normal Form (3NF)**: Clean entity boundaries preventing duplicate authoritative records.
2. **Decimal-Safe Financial Columns**: All fees, unit prices, and subtotals stored as integers representing minor currency units (Ghanaian Pesewas: 100 pesewas = GHS 1.00).
3. **Immutable Price Snapshots**: `OrderItem` stores the historical `unit_price_pesewas` and `subtotal_pesewas` captured at checkout time.
4. **Idempotent Payment Events**: Payment webhook events table with unique constraints on `(provider, event_id)` prevents double-crediting.
5. **Decoupled Item vs. Order State**: Service items possess independent preparation and review lifecycles (`item_status`) from overall order state (`request_status`).

## 2. Table Specifications

### `applicants`
Stores applicant contact and institutional identification details.
- `id`: UUID, Primary Key, Default `gen_random_uuid()`
- `index_number`: VARCHAR(50), Indexed
- `legal_name`: VARCHAR(255), Not Null
- `phone`: VARCHAR(30), Not Null, Indexed
- `alt_phone`: VARCHAR(30), Nullable
- `email`: VARCHAR(255), Not Null, Indexed
- `faculty`: VARCHAR(255), Not Null
- `programme`: VARCHAR(255), Not Null
- `status`: VARCHAR(50), Not Null (e.g. 'CONTINUING', 'COMPLETED')
- `graduation_year`: INTEGER, Nullable
- `country`: VARCHAR(100), Default 'Ghana'
- `region`: VARCHAR(100), Not Null
- `address`: TEXT, Not Null
- `created_at`: TIMESTAMPTZ, Default `NOW()`

### `orders`
The master container for an academic request.
- `id`: UUID, Primary Key
- `reference_number`: VARCHAR(50), Unique, Indexed (format: `CUG-REQ-YYYY-XXXX`)
- `applicant_id`: UUID, Foreign Key &rarr; `applicants(id)`
- `reason`: VARCHAR(100), Not Null
- `recipient_type`: VARCHAR(50), Not Null ('SELF', 'ORGANIZATION', 'OTHER')
- `recipient_name`: VARCHAR(255), Nullable
- `recipient_attn`: VARCHAR(255), Nullable
- `recipient_ref`: VARCHAR(100), Nullable
- `subtotal_pesewas`: BIGINT, Not Null
- `delivery_fee_pesewas`: BIGINT, Not Null Default 0
- `total_amount_pesewas`: BIGINT, Not Null
- `payment_status`: VARCHAR(50), Default 'PENDING' ('PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED', 'REFUNDED')
- `request_status`: VARCHAR(50), Default 'SUBMITTED' ('SUBMITTED', 'AWAITING_CLEARANCE', 'UNDER_REVIEW', 'ACTION_REQUIRED', 'PROCESSING', 'AWAITING_APPROVAL', 'APPROVED', 'READY_FOR_PICKUP', 'DISPATCHED', 'COMPLETED', 'REJECTED')
- `paid_at`: TIMESTAMPTZ, Nullable
- `created_at`: TIMESTAMPTZ, Default `NOW()`
- `updated_at`: TIMESTAMPTZ, Default `NOW()`

### `order_items`
Individual services requested within an order.
- `id`: UUID, Primary Key
- `order_id`: UUID, Foreign Key &rarr; `orders(id)` On Delete Cascade
- `service_id`: UUID, Foreign Key &rarr; `academic_services(id)`
- `service_code`: VARCHAR(50), Not Null
- `service_title`: VARCHAR(255), Not Null
- `quantity`: INTEGER, Not Null Check (`quantity >= 1`)
- `unit_price_pesewas`: BIGINT, Not Null
- `subtotal_pesewas`: BIGINT, Not Null
- `service_options`: JSONB, Default '{}'
- `item_status`: VARCHAR(50), Default 'PENDING' ('PENDING', 'PREPARING', 'AWAITING_REVIEW', 'APPROVED', 'READY', 'DISPATCHED', 'COMPLETED', 'ACTION_REQUIRED')
- `created_at`: TIMESTAMPTZ, Default `NOW()`

### `order_deliveries`
Fulfillment logistics details.
- `id`: UUID, Primary Key
- `order_id`: UUID, Foreign Key &rarr; `orders(id)` Unique
- `delivery_method`: VARCHAR(50), Not Null ('SELF_PICKUP', 'PROXY_PICKUP', 'EMAIL', 'DOMESTIC_COURIER', 'INTERNATIONAL_COURIER')
- `recipient_name`: VARCHAR(255), Nullable
- `recipient_phone`: VARCHAR(50), Nullable
- `recipient_email`: VARCHAR(255), Nullable
- `destination_country`: VARCHAR(100), Nullable
- `city`: VARCHAR(100), Nullable
- `address_line`: TEXT, Nullable
- `gps_address`: VARCHAR(50), Nullable
- `postal_code`: VARCHAR(50), Nullable
- `proxy_name`: VARCHAR(255), Nullable
- `proxy_ghana_card`: VARCHAR(50), Nullable
- `courier_provider`: VARCHAR(100), Nullable
- `courier_tracking_number`: VARCHAR(100), Nullable

### `payment_attempts` & `payment_webhook_events`
Audit trail of provider transactions and raw webhooks.
- `payment_attempts`: `id`, `order_id`, `provider`, `provider_reference`, `amount_pesewas`, `currency`, `status`, `initiated_at`, `completed_at`
- `payment_webhook_events`: `id`, `provider`, `event_id` (Unique), `event_type`, `payload`, `processed`, `received_at`

### `financial_clearances`, `item_preparations`, `registrar_approvals`, `item_dispatches`
Staff role audit tables capturing transitions by Finance, Records, Registrar, and Dispatch.
