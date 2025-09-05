### MCP Server for CasaNawal

This lightweight MCP-style HTTP server exposes tools to interact with Neon (Postgres), Render, Netlify, and GitHub.

Start locally:
```bash
npm run mcp
```

Endpoints:
- POST /tools/neon_query { sql, params? }
- GET  /tools/render/deploys
- POST /tools/render/deploy
- POST /tools/netlify/deploy
- GET  /tools/github/repo

Environment variables (see ENV_SETUP.md):
- MCP_PORT (default 4100)
- DATABASE_URL, DB_SSL
- RENDER_SERVICE_ID, RENDER_API_KEY
- NETLIFY_BUILD_HOOK_URL
- GITHUB_REPO, GITHUB_TOKEN (optional)

Cursor configuration example (~/.cursor/mcp.json):
```json
{
  "servers": [
    {
      "name": "casanawal-mcp",
      "url": "http://localhost:4100"
    }
  ]
}
```

Security note: keep tokens in your local .env; do not commit.

