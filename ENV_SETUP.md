### Copy-paste .env (Production: Render + Neon + Netlify)

```env
# Frontend (Netlify)
VITE_API_BASE=https://<your-render-service>.onrender.com/api

# Backend (Render) – Neon connection
DATABASE_URL=postgresql://neondb_owner:npg_wH7iu5RQJTdh@ep-sparkling-night-aglvdfcg-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DB_SSL=true
DB_SSLMODE=require

# Neon Data API (optional)
NEON_DATA_API_BASE=https://ep-sparkling-night-aglvdfcg.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1
NEON_DATA_API_KEY=
NEON_JWKS_URL=https://api.stack-auth.com/api/v1/projects/07713c84-a8b6-476c-990e-b8fe9e1eb129/.well-known/jwks.json

# Server
NODE_ENV=production
PORT=8080

# Auth
JWT_SECRET=casanawal_prod_jwt_7c1f6a0d3b0e4d51b2c49c6e8a9f1f23

# Admin seed (can be rotated later)
ADMIN_EMAIL=elantaki.dijadiss@gmail.com
ADMIN_PASSWORD=XCDXCD963j3j+.1

# MCP server (optional)
MCP_PORT=4100
RENDER_SERVICE_ID=srv-d2th13ggjchc739s4vmg
RENDER_API_KEY=
NETLIFY_BUILD_HOOK_URL=
GITHUB_REPO=JadissEL/CASANAWAL
GITHUB_TOKEN=
```

Notes
- Replace `<your-render-service>` with your actual Render service subdomain.
- You can rotate `JWT_SECRET` and `ADMIN_PASSWORD` anytime; these values are just for initial setup.

