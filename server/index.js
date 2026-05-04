import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import battlesRouter from './routes/battles.js';
import simulateRouter from './routes/simulate.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/battles', battlesRouter);
app.use('/api/simulate', simulateRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
