# CUG ASRVS: Deployment & Operations Guide

## 1. Environment Configurations

```env
# Server Runtime
NODE_ENV=production
PORT=5000
API_BASE_URL=https://asrvs.cug.edu.gh/api/v1
CLIENT_ORIGIN=https://asrvs.cug.edu.gh

# Database
DATABASE_URL=postgresql://cug_user:secure_password@localhost:5432/cug_asrvs?schema=public

# Security & Secrets
JWT_SECRET=cug-super-secret-institution-token-key-2026
SESSION_SECRET=cug-session-secret-key-salt

# Payment Providers (Paystack / Hubtel)
PAYMENT_PROVIDER=mock # or paystack
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_WEBHOOK_SECRET=whsec_...

# Notification Providers
SMS_PROVIDER=mock # or hubtel / arkesel
SMS_API_KEY=...
EMAIL_HOST=smtp.cug.edu.gh
EMAIL_PORT=587
EMAIL_USER=registry@cug.edu.gh
EMAIL_PASS=...
```

## 2. Production Checklist
1. PostgreSQL database provisioned with SSL connections enforced.
2. Prisma database migrations executed: `npx prisma migrate deploy`.
3. Seed data initialized: `npx prisma db seed`.
4. Production build:
   - Client: `npm --workspace=client run build`
   - Server: `npm --workspace=server run build`
5. Process supervisor (PM2 or Docker Compose container) running behind an Nginx reverse proxy with TLS 1.3 certificates.
6. Rate limiting and CORS origins locked down to the official university domain.
