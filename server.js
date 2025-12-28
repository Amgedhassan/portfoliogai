
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { existsSync } = require('fs');
const compression = require('compression');
const cors = require('cors');
const esbuild = require('esbuild');
const { exec } = require('child_process');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

console.log('\n\n###########################################');
console.log('   AMGAD PORTFOLIO ENGINE v2.0.3 [SYNC] ');
console.log('###########################################');
console.log(`📍 Root: ${__dirname}`);
console.log(`🔑 Key: ${process.env.API_KEY ? 'Active' : 'Missing'}`);
console.log('###########################################\n');

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.get('/api/health', (req, res) => res.json({ status: 'online', v: '2.0.3' }));

app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

app.use(async (req, res, next) => {
  const url = req.url.split('?')[0];
  if (url.endsWith('.tsx') || url.endsWith('.ts')) {
    const filePath = path.join(__dirname, url);
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
          'process.env.API_KEY': `"${process.env.API_KEY || ''}"`
        }
      });
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      return res.send(result.code);
    } catch (err) {
      console.error(`[❌ COMPILER ERROR] ${url}:`, err.message);
      res.setHeader('Content-Type', 'application/javascript');
      return res.status(500).send(`console.error("COMPILATION_ERROR: ${err.message}");`);
    }
  }
  next();
});

app.get('/api/portfolio', async (req, res) => {
  try {
    if (!existsSync(DATA_PATH)) {
      return res.json({ status: "initializing" });
    }
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

app.use(express.static(__dirname));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Engine live at http://0.0.0.0:${PORT}`);
});
