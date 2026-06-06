import express from 'express';
import cors from 'cors';
import { fetchSSCNotices } from './scraper.js';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ssc-notices', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const notices = await fetchSSCNotices(force);
    res.json({ success: true, data: notices });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch SSC notices' });
  }
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const pdfData = await pdfParse(req.file.buffer);
    res.json({ success: true, text: pdfData.text });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    res.status(500).json({ success: false, error: 'Failed to parse PDF' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/ssc-notices`);
});
