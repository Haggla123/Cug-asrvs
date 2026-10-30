# CUG ASRVS: Deployment & Operations Guide

## 1. Environment Configurations

```env
# Server Runtime
NODE_ENV=production
PORT=5000
API_BASE_URL=https://asrvs.cug.edu.gh/api/v1
CLIENT_ORIGIN=https://asrvs.cug.edu.gh

# Database
DATABASE_URL=<database-secret-manager-reference>

# Security & Secrets (generate unique secrets in the deployment secret manager)
JWT_SECRET=<required-secret>
SESSION_SECRET=<required-secret>

# Payment Providers (configure only after implementing the server integration)
PAYMENT_PROVIDER=<configured-provider>
PAYSTACK_SECRET_KEY=<secret-manager-reference>
PAYSTACK_PUBLIC_KEY=<provider-public-key>
PAYSTACK_WEBHOOK_SECRET=<secret-manager-reference>

# Notification Providers
SMS_PROVIDER=<configured-provider>
SMS_API_KEY=<secret-manager-reference>
EMAIL_HOST=smtp.cug.edu.gh
EMAIL_PORT=587
EMAIL_USER=registry@cug.edu.gh
EMAIL_PASS=<secret-manager-reference>
```

Never commit real credentials or use shared/example secrets in production. The variables above are documentation placeholders; this repository does not currently read or validate them because the server is not implemented.

## 2. Production Checklist (Target State)

The following checklist describes the target production setup and applies only after the backend is implemented.

1. PostgreSQL database provisioned with SSL connections enforced.
2. Prisma database migrations executed: `npx prisma migrate deploy`.
3. Seed data initialized: `npx prisma db seed`.
4. Production build:
   - Client: `npm --workspace=client run build`
   - Server: `npm --workspace=server run build`
5. Process supervisor (PM2 or Docker Compose container) running behind an Nginx reverse proxy with TLS 1.3 certificates.
6. Rate limiting and CORS origins locked down to the official university domain.

## 3. Deployment Status

This checkout is a frontend prototype and is **not ready for production deployment**. The `server/` workspace described in the architecture and API documents is absent. The client has no production API base URL, database, authentication, payment gateway, consent-file upload, registry tracking, health check, or server-side authorization. Payment, verification, and status lookup are deliberately unavailable in the UI until those services are implemented and verified. The staff screen is a local simulation and provides no access control; it must not be used to process real records.

Before deployment, implement and security-review the backend and database, connect the client to those services, remove local-only handling of applicant personal data, configure and validate production secrets, implement staff authentication and authorization, integrate a real payment provider with signed idempotent webhooks, and run authenticated end-to-end tests against a non-production environment. Then document backup, migration, monitoring, and rollback procedures.
