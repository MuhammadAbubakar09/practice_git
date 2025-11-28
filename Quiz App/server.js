require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const PORT = process.env.PORT || 3005;
const DATA_DIR = process.env.DATA_DIR || 'data';
const DATA_FILE = path.join(__dirname, DATA_DIR, process.env.DATA_FILE || 'quiz-data.json');
const API_URL = process.env.API_URL;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/fetch-quiz', async (req, res) => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      return res.status(500).json({ success: false, message: 'Invalid data received from API' });
    }

    if (!fs.existsSync(path.dirname(DATA_FILE))) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(data.results, null, 2));
    res.json({ success: true, data: data.results });
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz data' });
  }
});

app.get('/api/quiz', (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(404).json({ success: false, message: 'Local quiz data not found' });
    }

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    res.json({ success: true, data });
  } catch (err) {
    console.error('Error reading quiz:', err);
    res.status(500).json({ success: false, message: 'Failed to read quiz data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
