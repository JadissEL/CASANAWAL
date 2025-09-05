#!/usr/bin/env node
import express from 'express';
import fetch from 'node-fetch';
import { Client } from 'pg';

// Simple MCP-style HTTP server exposing tool endpoints for Cursor
// Configure via env: NEON DATABASE_URL, NETLIFY_SITE_ID/TOKEN, RENDER_SERVICE_ID/TOKEN, GITHUB_TOKEN

const app = express();
app.use(express.json());

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

// Neon query tool
app.post('/tools/neon_query', async (req, res) => {
  try {
    const { sql, params } = req.body || {};
    if (!sql || typeof sql !== 'string') return res.status(400).json({ error: 'sql required' });
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    await client.connect();
    const result = await client.query(sql, params || []);
    await client.end();
    res.json({ rows: result.rows, rowCount: result.rowCount });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Render deployments list
app.get('/tools/render/deploys', async (_req, res) => {
  try {
    const serviceId = requireEnv('RENDER_SERVICE_ID');
    const token = requireEnv('RENDER_API_KEY');
    const r = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Trigger Render deploy
app.post('/tools/render/deploy', async (_req, res) => {
  try {
    const serviceId = requireEnv('RENDER_SERVICE_ID');
    const token = requireEnv('RENDER_API_KEY');
    const r = await fetch(`https://api.render.com/v1/services/${serviceId}/deploys`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearCache: true }),
    });
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Netlify: trigger build hook
app.post('/tools/netlify/deploy', async (_req, res) => {
  try {
    const hookUrl = requireEnv('NETLIFY_BUILD_HOOK_URL');
    const r = await fetch(hookUrl, { method: 'POST' });
    res.json({ status: r.status, ok: r.ok });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GitHub repo info
app.get('/tools/github/repo', async (_req, res) => {
  try {
    const repo = requireEnv('GITHUB_REPO'); // e.g. JadissEL/CASANAWAL
    const token = process.env.GITHUB_TOKEN;
    const headers: any = { 'User-Agent': 'mcp-server' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const r = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    const data = await r.json();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const port = Number(process.env.MCP_PORT || 4100);
app.listen(port, () => {
  console.log(`MCP server running on http://localhost:${port}`);
});


