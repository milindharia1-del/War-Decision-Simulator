import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const battles = JSON.parse(readFileSync(join(__dirname, '../data/battles.json'), 'utf-8'));

router.get('/', (_req, res) => {
  res.json(battles);
});

export default router;
