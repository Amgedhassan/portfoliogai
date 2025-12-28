
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// ==========================================
// 🚀 ENGINE STARTUP: VERSION 1.6.0
// ==========================================
console.log('\n\n');
console.log('###########################################');
console.log('   AMGAD PORTFOLIO ENGINE v1.6.0 ACTIVE   ');
console.log('###########################################');
console.log(`📍 Root: ${__dirname}`);
console.log(`⚙️  Node: ${process.version}`);
console.log(`🔑 Key: ${process.env.API_KEY ? 'Present' : 'Missing (Check .env)'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Debug logger
app.use((req, res, next) => {
  if (!req.url.includes('node_modules')) {
    console.log(`[Request] ${req.method} ${req.url}`);
  }
  next();
});

/**
 * TSX TRANSPILLER MIDDLEWARE
 * Converts modern React/TypeScript code into something the browser can run.
 */
app.get(/\.tsx?$/, async (req, res) => {
  const urlPath = req.path;
  const filePath = path.join(__dirname, urlPath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    const result = await esbuild.transform(content, {
      loader: urlPath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      jsx: 'automatic', // Required for React 18+
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log(`✨ Transpiled: ${urlPath}`);
    
    // Force JavaScript MIME type
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(result.code);
  } catch (err) {
    console.error(`❌ Transpiler Error (${urlPath}):`, err.message);
    res.status(500).send(`Transpiler Error: ${err.message}`);
  }
});

// Environment configuration for the browser
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.json({ status: "initializing" });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Save failed" });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'online', version: '1.6.0' }));

// Serve static files
app.use(express.static(__dirname));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log('-------------------------------------------\n');
});
