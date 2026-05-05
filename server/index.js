import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import battlesRouter from './routes/battles.js';
import simulateRouter from './routes/simulate.js';
import { simulateLimiter } from './middleware/rateLimiter.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});
app.use('/api/battles', battlesRouter);
app.use('/api/simulate', simulateLimiter, simulateRouter);

// Serve battle images
app.use('/images', express.static(join(__dirname, 'public/images')));

// Serve built React client
const distPath = join(__dirname, '../client/dist');
app.use(express.static(distPath));

// SPA fallback — all non-API routes return index.html
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
