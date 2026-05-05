// Downloads one Wikipedia thumbnail per battle into server/public/images/
// Run once: node scripts/download-images.js
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/images');
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const BATTLES = {
  stalingrad:            'Battle_of_Stalingrad',
  dday:                  'Normandy_landings',
  'battle-of-britain':   'Battle_of_Britain',
  hiroshima:             'Atomic_bombings_of_Hiroshima_and_Nagasaki',
  'cuban-missile-crisis':'Cuban_Missile_Crisis',
  midway:                'Battle_of_Midway',
  'pearl-harbor':        'Attack_on_Pearl_Harbor',
  'berlin-1945':         'Battle_of_Berlin',
  'tet-offensive':       'Tet_Offensive',
  waterloo:              'Battle_of_Waterloo',
};

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'WarDecisionSimulator/1.0 (educational project)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  await pipeline(res.body, createWriteStream(dest));
}

async function getWikipediaThumbnail(article) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(article)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'WarDecisionSimulator/1.0 (educational project)' },
  });
  if (!res.ok) throw new Error(`Wikipedia API ${res.status} for ${article}`);
  const data = await res.json();
  // Prefer original image, fall back to thumbnail
  return data.originalimage?.source || data.thumbnail?.source || null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [id, article] of Object.entries(BATTLES)) {
  const dest = join(OUT_DIR, `${id}.jpg`);

  // Skip if already downloaded (> 10 KB means it's a real image)
  if (existsSync(dest) && (await import('fs')).statSync(dest).size > 10_000) {
    console.log(`${id} → already downloaded, skipping`);
    continue;
  }

  try {
    process.stdout.write(`${id} → fetching Wikipedia summary...`);
    const imgUrl = await getWikipediaThumbnail(article);
    if (!imgUrl) { console.log(' no image found, skipping'); continue; }
    process.stdout.write(` downloading...`);
    await downloadFile(imgUrl, dest);
    console.log(` ✓ saved`);
  } catch (err) {
    console.log(` ✗ ${err.message}`);
  }

  await sleep(2000); // avoid Wikipedia rate limiting
}

console.log('\nDone. Images saved to server/public/images/');
