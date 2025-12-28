
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// UNIQUE HEADER - If you don't see this in 'pm2 logs', you are running the wrong code!
console.log('===========================================');
console.log('🚀 SYSTEM BOOT: AMGAD DESIGN ENGINE v1.4.0');
console.log('===========================================');
console.log(`Working Directory: ${__dirname}`);
console.log(`API_KEY Present: ${!!process.env.API_KEY}`);

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

/**
 * TSX/TS COMPILER MIDDLEWARE
 * This intercepts any request ending in .tsx or .ts
 */
app.get(/\.tsx?$/, async (req, res) => {
  const urlPath = req.path;
  const filePath = path.join(__dirname, urlPath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Convert TSX -> Browser JS on the fly
    const result = await esbuild.transform(content, {
      loader: urlPath.endsWith('.tsx') ? 'tsx' : 'ts',
      format: 'esm',
      target: 'esnext',
      sourcemap: 'inline',
      jsx: 'automatic', // Critical for React 18/19
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log(`[Transpiler] COMPLIED: ${urlPath}`);
    
    // Explicitly set MIME type so the browser doesn't block it
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(result.code);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`[Transpiler] 404: ${urlPath}`);
      res.status(404).send('File not found');
    } else {
      console.error(`[Transpiler] ERROR ${urlPath}:`, err.message);
      res.status(500).send('Compilation failed');
    }
  }
});

// Provides environment variables to the browser
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

// API Routes
const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

app.get('/api/health', (req, res) => res.json({ status: 'online', version: '1.4.0' }));

app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch {
    res.json({ status: "new_installation" });
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

// Static assets
app.use(express.static(__dirname));

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ENGINE ACTIVE ON PORT ${PORT}`);
  console.log('-------------------------------------------');
});
