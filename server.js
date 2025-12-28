
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));

// CORS Configuration
app.use(cors({
  origin: ['https://amgad.design', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

const DATA_PATH = path.join(__dirname, 'portfolio_data.json');

// Serve a dynamic config file so the frontend can access the API Key
app.get('/env-config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.process = { env: { API_KEY: "${process.env.API_KEY || ''}" } };`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', domain: 'amgadsrvr.amgad.design', timestamp: new Date().toISOString() });
});

app.get('/api/portfolio', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.json({ error: "Initializing" });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Save failed" });
  }
});

// Serve static files
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production Server active on port ${PORT}`);
});
