
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

console.log('\n\n###########################################');
console.log('   AMGAD PORTFOLIO ENGINE v2.3.0 [HOTFIX] ');
console.log('###########################################');
console.log(`📍 Root: ${__dirname}`);
console.log(`🔑 Key: ${process.env.API_KEY ? 'Active' : 'Missing'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// 1. Health check
app.get('/api/health', (req, res) => res.json({ status: 'online', v: '2.3.0' }));

// 2. Injection for browser process.env shim
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}", NODE_ENV: "production" } };`);
});

// 3. PRIORITY TS/TSX TRANSFORMER
// We use a regex route to ensure this handler captures all .ts/.tsx requests specifically.
app.get(/(.*)\.(ts|tsx)$/, async (req, res) => {
  const url = req.path;
  const relativePath = url.startsWith('/') ? url.slice(1) : url;
  const filePath = path.join(__dirname, relativePath);

  // Force JS MIME type immediately
  res.type('application/javascript');

  if (!existsSync(filePath)) {
    console.warn(`[⚠️ 404] ${url} not found`);
    return res.status(404).send(`console.error("File not found: ${url}");`);
  }

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const result = await esbuild.transform(content, {
      loader: url.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      jsx: 'automatic',
      define: { 
        'process.env.NODE_ENV': '"production"',
        'process.env.API_KEY': `"${process.env.API_KEY || ''}"`,
        'global': 'window'
      }
    });

    return res.send(result.code);
  } catch (err) {
    console.error(`[❌ COMPILER ERROR] ${url}:`, err.message);
    return res.send(`console.error("TRANSFORMATION_ERROR at ${url}: ${err.message.replace(/"/g, "'")}");`);
  }
});

// 4. API Routes
app.get('/api/portfolio', async (req, res) => {
  try {
    if (!existsSync(DATA_PATH)) return res.json({ status: "initializing" });
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Read failure" });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Save failure" });
  }
});

// 5. Static files (served after the transformer)
app.use(express.static(__dirname));

// 6. SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Engine live at http://0.0.0.0:${PORT}`);
});
