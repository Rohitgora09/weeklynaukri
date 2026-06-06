import express from 'express';
import cors from 'cors';
import { fetchSSCNotices } from './scraper.js';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/ssc-notices`);
});
