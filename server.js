
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Startup Pre-flight Validation
console.log('--- STARTUP PRE-FLIGHT ---');
console.log(`Node Version: ${process.version}`);
console.log(`Target Port: ${PORT}`);
if (!process.env.API_KEY) {
  console.error('CRITICAL: API_KEY is missing from environment variables!');
}
console.log('--------------------------');

// Middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));

// CORS Configuration
app.use(cors({
  origin: ['https://amgad.design', 'http://amgad.design', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * RECURSIVE ON-THE-FLY TRANSPILLER
 * Matches any path ending in .ts or .tsx regardless of directory depth.
 */
app.get(/\.(ts|tsx)$/, async (req, res, next) => {
  // Extract file path from URL and clean it
  const urlPath = req.path.startsWith('/') ? req.path : `/${req.path}`;
  const filePath = path.join(__dirname, urlPath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Transpile using esbuild
    const result = await esbuild.transform(content, {
      loader: urlPath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      // 'automatic' handles React 18/19 JSX without requiring "import React" in every file
      jsx: 'automatic', 
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log(`[Transpiler] Processed: ${urlPath}`);
    
    // Crucial: Set correct MIME type to satisfy strict browser module checks
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(result.code);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`[Transpiler] File not found: ${filePath}`);
      res.status(404).send('File not found');
    } else {
      console.error(`[Transpiler] Error for ${urlPath}:`, err);
      res.status(500).send('Internal Server Error during transpilation');
    }
  }
});

const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

// Serve a dynamic config file so the frontend can access the API Key
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.json({ status: "initializing" });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ error: "Save failed" });
  }
});

// Serve static files (HTML, CSS, Images, etc.)
app.use(express.static(__dirname));

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Senior Design Portfolio Engine active at http://127.0.0.1:${PORT}`);
  console.log('Mode: Production-Ready Transpilation (esbuild)');
});
