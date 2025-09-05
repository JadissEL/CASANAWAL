### .env templates (copy-paste)

#### Production (Render + Neon + Netlify)
```env
# Frontend (Netlify)
VITE_API_BASE=https://<your-render-service>.onrender.com/api

# Backend (Render) – Neon connection
DATABASE_URL=postgresql://neondb_owner:YOUR_NEON_PASSWORD@ep-sparkling-night-aglvdfcg-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DB_SSL=true
DB_SSLMODE=require

# Optional: if you prefer discrete vars instead of DATABASE_URL
# DB_HOST=ep-sparkling-night-aglvdfcg-pooler.c-2.eu-central-1.aws.neon.tech
# DB_PORT=6432
# DB_NAME=neondb
# DB_USER=neondb_owner
# DB_PASSWORD=YOUR_NEON_PASSWORD

# Neon Data API (optional)
NEON_DATA_API_BASE=https://ep-sparkling-night-aglvdfcg.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1
NEON_DATA_API_KEY=
NEON_JWKS_URL=https://api.stack-auth.com/api/v1/projects/07713c84-a8b6-476c-990e-b8fe9e1eb129/.well-known/jwks.json

# Server
NODE_ENV=production
PORT=8080

# Auth
JWT_SECRET=<generate-strong-secret>

# Admin seed (change for production)
ADMIN_EMAIL=elantaki.dijadiss@gmail.com
ADMIN_PASSWORD=<set-strong-admin-password>

# Business
DELIVERY_FEE=25
DEPOSIT_PERCENTAGE=50
AUTO_CANCEL_HOURS=2

# Payments (example placeholders)
BANK_1_NAME=Banque Populaire
BANK_1_RIB=011 780 0000123456789 38
BANK_1_BENEFICIARY=CASANAWAL CUISINE SARL
BANK_2_NAME=Attijariwafa Bank
BANK_2_RIB=007 840 0000987654321 75
BANK_2_BENEFICIARY=CASANAWAL CUISINE SARL
CASH_DEPOSIT_BENEFICIARY=CASANAWAL CUISINE
SUPPORT_PHONE=+212 6 XX XX XX XX

# Email (notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password
FROM_EMAIL=noreply@casanawal.ma
```

#### Local development (optional, if using local Postgres)
```env
# Frontend (local dev uses relative /api)
VITE_API_BASE=

# Backend – local Postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casanawal
DB_USER=postgres
DB_PASSWORD=your_local_password
DB_POOL_SIZE=20
DB_SSL=false
DB_SSLMODE=disable

# Server
NODE_ENV=development
PORT=8080

# Auth
JWT_SECRET=dev_secret_only_for_local

# Admin seed (dev only)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=dev_admin_password

# Business / Payments / Email – same structure as production (use dev-safe values)
DELIVERY_FEE=25
DEPOSIT_PERCENTAGE=50
AUTO_CANCEL_HOURS=2
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password
FROM_EMAIL=noreply@localhost
```

Notes
- For production, prefer `DATABASE_URL` with Neon; ensure `DB_SSL=true` and `DB_SSLMODE=require`.
- On Netlify set only `VITE_API_BASE`. On Render set DB vars and server vars.
- Update secrets (JWT, ADMIN_PASSWORD, SMTP) with strong values before deploying.

