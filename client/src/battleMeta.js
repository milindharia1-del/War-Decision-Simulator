// Images are downloaded once by: cd server && npm run download-images
// Then served locally at /images/{id}.jpg
export const BATTLE_META = {
  stalingrad: {
    img: '/images/stalingrad.jpg',
    gradient: 'linear-gradient(160deg,#1a0505 0%,#2d1010 100%)',
    accent: '#ef4444',
    era: 'World War II · Eastern Front',
  },
  dday: {
    img: '/images/dday.jpg',
    gradient: 'linear-gradient(160deg,#050d1a 0%,#0a1f3d 100%)',
    accent: '#60a5fa',
    era: 'World War II · Western Front',
  },
  'battle-of-britain': {
    img: '/images/battle-of-britain.jpg',
    gradient: 'linear-gradient(160deg,#07050f 0%,#12103a 100%)',
    accent: '#818cf8',
    era: 'World War II · Air War',
  },
  hiroshima: {
    img: '/images/hiroshima.jpg',
    gradient: 'linear-gradient(160deg,#1a0e00 0%,#2d1f05 100%)',
    accent: '#fbbf24',
    era: 'World War II · Pacific',
  },
  'cuban-missile-crisis': {
    img: '/images/cuban-missile-crisis.jpg',
    gradient: 'linear-gradient(160deg,#001a0a 0%,#032d18 100%)',
    accent: '#34d399',
    era: 'Cold War · 1962',
  },
  midway: {
    img: '/images/midway.jpg',
    gradient: 'linear-gradient(160deg,#00101f 0%,#052033 100%)',
    accent: '#38bdf8',
    era: 'World War II · Pacific',
  },
  'pearl-harbor': {
    img: '/images/pearl-harbor.jpg',
    gradient: 'linear-gradient(160deg,#1a0000 0%,#2d0505 100%)',
    accent: '#fb7185',
    era: 'World War II · Pacific',
  },
  'berlin-1945': {
    img: '/images/berlin-1945.jpg',
    gradient: 'linear-gradient(160deg,#0a0a0a 0%,#1c1c1c 100%)',
    accent: '#d1d5db',
    era: 'World War II · Final Days',
  },
  'tet-offensive': {
    img: '/images/tet-offensive.jpg',
    gradient: 'linear-gradient(160deg,#0d1700 0%,#1a2d00 100%)',
    accent: '#a3e635',
    era: 'Vietnam War · 1968',
  },
  waterloo: {
    img: '/images/waterloo.jpg',
    gradient: 'linear-gradient(160deg,#0e0a1a 0%,#1e1530 100%)',
    accent: '#c084fc',
    era: 'Napoleonic Wars · 1815',
  },
};

export function getMeta(id) {
  return BATTLE_META[id] || { img: '', gradient: 'linear-gradient(160deg,#111 0%,#222 100%)', accent: '#f59e0b', era: '' };
}
