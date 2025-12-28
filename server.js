
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
console.log('   AMGAD PORTFOLIO ENGINE v1.9.0 ACTIVE   ');
console.log('###########################################');
console.log(`📍 Root: ${__dirname}`);
console.log(`🔑 Key: ${process.env.API_KEY ? 'Active' : 'Missing'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'online', v: '1.9.0' }));

// Environment injection
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

/**
 * HIGH-PRIORITY TRANSPILER ROUTES
 * These catch requests BEFORE any static middleware or file serving.
 */
app.get(['/*.tsx', '/*.ts'], async (req, res) => {
  const fileName = req.path;
  const filePath = path.join(__dirname, fileName);
  
  console.log(`[🚀 Compiler] Intercepted: ${fileName}`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const result = await esbuild.transform(content, {
      loader: fileName.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' }
    });

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.send(result.code);
  } catch (err) {
    console.error(`[🔥 Compiler Error] ${fileName}:`, err.message);
    res.setHeader('Content-Type', 'application/javascript');
    return res.status(500).send(`console.error("TRANSPILE_FAIL: ${err.message.replace(/"/g, "'")}");`);
  }
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

// Serve everything else as static (images, etc)
app.use(express.static(__dirname));

// SPA Fallback for any other route (returns index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ System logic ready at http://0.0.0.0:${PORT}`);
});
