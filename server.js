
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

// Load .env variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

console.log('-------------------------------------------');
console.log('🚀 AMGAD PORTFOLIO ENGINE v1.3.0');
console.log(`📅 Started: ${new Date().toISOString()}`);
console.log(`📦 Node: ${process.version}`);
if (!process.env.API_KEY) {
  console.warn('⚠️ WARNING: API_KEY not found in .env file!');
}
console.log('-------------------------------------------');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

/**
 * TSX/TS TRANSPILLER MIDDLEWARE
 * This MUST be defined before express.static to work.
 * It catches requests for .tsx files and sends back compiled JavaScript.
 */
app.get(/\.tsx?(\?.*)?$/, async (req, res) => {
  // Get the clean path without query strings
  const urlPath = req.path;
  const filePath = path.join(__dirname, urlPath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Convert JSX/TSX to JS using esbuild
    const result = await esbuild.transform(content, {
      loader: urlPath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      jsx: 'automatic', // Important: handles React 18/19 without explicit imports
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log(`[Transpiler] Compiled: ${urlPath}`);
    
    // Force the browser to treat this as a JavaScript module
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(result.code);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`[Transpiler] 404 Not Found: ${urlPath}`);
      res.status(404).send('File not found');
    } else {
      console.error(`[Transpiler] Error in ${urlPath}:`, err.message);
      res.status(500).send('Internal Transpilation Error');
    }
  }
});

// Environment configuration for frontend (Gemini API)
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

// API Endpoints
app.get('/api/health', (req, res) => res.json({ status: 'active', node: process.version }));

const DATA_PATH = path.join(__dirname, 'portfolio_data.json');
app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json({ status: "initializing" });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Cloud sync failed" });
  }
});

// Serve static assets (CSS, images, etc)
app.use(express.static(__dirname));

// Fallback for SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`🌐 Application URL: http://amgad.design`);
});
