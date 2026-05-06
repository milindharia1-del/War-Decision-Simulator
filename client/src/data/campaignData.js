import { getMeta } from '../battleMeta';

export const FACTIONS = [
  {
    id: 'allied',
    name: 'Allied Forces',
    emblem: '⚜',
    color: '#4A7FA5',
    description: 'Lead the Allies to liberate Europe and crush the Axis.',
    motto: 'For freedom and democracy.',
  },
  {
    id: 'axis',
    name: 'Axis Powers',
    emblem: '⚔',
    color: '#C9A84C',
    description: 'Command the Wehrmacht. Hold Europe. Forge a new order.',
    motto: 'For the glory of the Reich.',
  },
  {
    id: 'soviet',
    name: 'Soviet Union',
    emblem: '★',
    color: '#C0392B',
    description: 'Defend the Motherland and drive the invaders to Berlin.',
    motto: 'For Mother Russia.',
  },
  {
    id: 'japan',
    name: 'Imperial Japan',
    emblem: '☀',
    color: '#E67E22',
    description: 'Expand the empire across the Pacific. Strike without mercy.',
    motto: 'For the Emperor and the Rising Sun.',
  },
];

// SVG node positions on a 1000x520 viewBox
export const BATTLE_NODES = {
  'pearl-harbor':          { x: 908, y: 215, label: 'Pearl Harbor',  region: 'Pacific',        year: 1941 },
  'battle-of-britain':     { x: 430, y: 130, label: 'Britain',       region: 'Western Europe', year: 1940 },
  midway:                  { x: 930, y: 185, label: 'Midway',        region: 'Pacific',        year: 1942 },
  dday:                    { x: 450, y: 162, label: 'Normandy',      region: 'Western Europe', year: 1944 },
  stalingrad:              { x: 635, y: 150, label: 'Stalingrad',    region: 'Eastern Front',  year: 1942 },
  'berlin-1945':           { x: 520, y: 142, label: 'Berlin',        region: 'Central Europe', year: 1945 },
  hiroshima:               { x: 820, y: 188, label: 'Hiroshima',     region: 'Pacific',        year: 1945 },
  'tet-offensive':         { x: 778, y: 240, label: 'Vietnam',       region: 'Southeast Asia', year: 1968 },
  'cuban-missile-crisis':  { x: 240, y: 242, label: 'Cuba',          region: 'Americas',       year: 1962 },
  waterloo:                { x: 460, y: 152, label: 'Waterloo',      region: 'Western Europe', year: 1815 },
};

export const CAMPAIGN_SEQUENCE = [
  'pearl-harbor',
  'battle-of-britain',
  'midway',
  'dday',
  'stalingrad',
  'berlin-1945',
  'hiroshima',
  'tet-offensive',
  'cuban-missile-crisis',
  'waterloo',
];

export function getScoreResult(plausibility) {
  if (plausibility === null || plausibility === undefined) {
    return { outcome: 'unknown', label: 'Uncertain', pts: 5, territoryState: 'contested' };
  }
  if (plausibility >= 8) return { outcome: 'decisive', label: 'Decisive Victory', pts: 15, territoryState: 'captured' };
  if (plausibility >= 5) return { outcome: 'pyrrhic',  label: 'Pyrrhic Victory',  pts: 8,  territoryState: 'contested' };
  if (plausibility >= 3) return { outcome: 'defeat',   label: 'Narrow Defeat',    pts: 3,  territoryState: 'lost' };
  return                        { outcome: 'rout',     label: 'Catastrophic Rout', pts: 0, territoryState: 'lost' };
}

export const BATTLES_PER_CAMPAIGN = CAMPAIGN_SEQUENCE.length;
export const MAX_POSSIBLE_SCORE = BATTLES_PER_CAMPAIGN * 15 + 20; // +20 completion bonus

export function getCommanderTitle(score) {
  const pct = score / MAX_POSSIBLE_SCORE;
  if (pct >= 0.85) return { title: 'Supreme Commander', color: '#6A0DAD' };
  if (pct >= 0.65) return { title: 'Field Marshal',     color: '#C9A84C' };
  if (pct >= 0.45) return { title: 'General',           color: '#A0522D' };
  if (pct >= 0.25) return { title: 'Colonel',           color: '#4A7FA5' };
  return                  { title: 'Lieutenant',         color: '#6B6357' };
}
