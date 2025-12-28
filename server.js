
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
console.log('   AMGAD PORTFOLIO ENGINE v1.7.0 ACTIVE   ');
console.log('###########################################');
console.log(`📍 Directory: ${__dirname}`);
console.log(`🔑 API_KEY Status: ${process.env.API_KEY ? 'ACTIVE' : 'MISSING'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Aggressive Request Logging
app.use((req, res, next) => {
  if (!req.url.includes('node_modules') && !req.url.includes('.png')) {
    console.log(`[HTTP] ${req.method} ${req.url}`);
  }
  next();
});

/**
 * TSX/TS ON-THE-FLY COMPILER
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
      jsx: 'automatic',
      define: { 'process.env.NODE_ENV': '"production"' }
    });
    
    console.log(`✨ [Compiler] Success: ${urlPath}`);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.send(result.code);
  } catch (err) {
    console.error(`🔥 [Compiler] Error in ${urlPath}:`, err.message);
    res.status(500).send(`/* Compiler Error: ${err.message} */`);
  }
});

app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

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

app.get('/api/health', (req, res) => res.json({ status: 'online', v: '1.7.0' }));
app.use(express.static(__dirname));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
});
