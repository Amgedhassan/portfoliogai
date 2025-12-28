
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

console.log('\n\n###########################################');
console.log('   AMGAD PORTFOLIO ENGINE v1.8.0 ACTIVE   ');
console.log('###########################################');
console.log(`📍 Root: ${__dirname}`);
console.log(`🔑 Key: ${process.env.API_KEY ? 'Active' : 'Missing'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Health check and environment
app.get('/api/health', (req, res) => res.json({ status: 'online', v: '1.8.0' }));
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

/**
 * CORE COMPILER MIDDLEWARE (V1.8.0)
 * This must run BEFORE express.static to catch .tsx requests.
 */
app.use(async (req, res, next) => {
  const isTsx = req.path.endsWith('.tsx');
  const isTs = req.path.endsWith('.ts');

  if (isTsx || isTs) {
    const filePath = path.join(__dirname, req.path);
    console.log(`[Transpiler] Processing: ${req.path}`);

    try {
      const content = await fs.readFile(filePath, 'utf8');
      const result = await esbuild.transform(content, {
        loader: isTsx ? 'tsx' : 'ts',
        format: 'esm',
        target: 'esnext',
        sourcemap: 'inline',
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"production"' }
      });

      // CRITICAL: Force the browser to treat this as JavaScript
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff'); // Security best practice
      return res.send(result.code);
    } catch (err) {
      console.error(`[Transpiler] Error in ${req.path}:`, err.message);
      res.setHeader('Content-Type', 'application/javascript');
      return res.status(500).send(`console.error("Transpiler Error: ${err.message.replace(/"/g, "'")}");`);
    }
  }
  next();
});

// Portfolio Data Endpoints
const DATA_PATH = path.join(__dirname, 'portfolio_data.json');
app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch { res.json({ status: "initializing" }); }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Save error" }); }
});

// Static assets
app.use(express.static(__dirname));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 v1.8.0 Engine ready at http://0.0.0.0:${PORT}`);
});
