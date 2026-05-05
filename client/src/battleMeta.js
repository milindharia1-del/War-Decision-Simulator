// Images are downloaded once by: cd server && npm run download-images
// Then served locally at /images/{id}.jpg
export const BATTLE_META = {
  stalingrad: {
    img: '/images/stalingrad.jpg',
    gradient: 'linear-gradient(160deg,#0D0000 0%,#1A0505 100%)',
    accent: '#C0392B',
    era: 'MCMXLII · Eastern Front',
  },
  dday: {
    img: '/images/dday.jpg',
    gradient: 'linear-gradient(160deg,#020810 0%,#071525 100%)',
    accent: '#4A7FA5',
    era: 'MCMXLIV · Western Front',
  },
  'battle-of-britain': {
    img: '/images/battle-of-britain.jpg',
    gradient: 'linear-gradient(160deg,#06040F 0%,#100D2A 100%)',
    accent: '#7B6FA8',
    era: 'MCMXL · The Air War',
  },
  hiroshima: {
    img: '/images/hiroshima.jpg',
    gradient: 'linear-gradient(160deg,#130B00 0%,#221500 100%)',
    accent: '#C9A84C',
    era: 'MCMXLV · The Pacific',
  },
  'cuban-missile-crisis': {
    img: '/images/cuban-missile-crisis.jpg',
    gradient: 'linear-gradient(160deg,#001208 0%,#01200F 100%)',
    accent: '#2E8B57',
    era: 'MCMLXII · The Cold War',
  },
  midway: {
    img: '/images/midway.jpg',
    gradient: 'linear-gradient(160deg,#000C17 0%,#031827 100%)',
    accent: '#2E86AB',
    era: 'MCMXLII · The Pacific',
  },
  'pearl-harbor': {
    img: '/images/pearl-harbor.jpg',
    gradient: 'linear-gradient(160deg,#130000 0%,#220303 100%)',
    accent: '#B5445A',
    era: 'MCMXLI · The Pacific',
  },
  'berlin-1945': {
    img: '/images/berlin-1945.jpg',
    gradient: 'linear-gradient(160deg,#070707 0%,#141414 100%)',
    accent: '#A89F8C',
    era: 'MCMXLV · The Final Days',
  },
  'tet-offensive': {
    img: '/images/tet-offensive.jpg',
    gradient: 'linear-gradient(160deg,#091000 0%,#142200 100%)',
    accent: '#6B8E23',
    era: 'MCMLXVIII · The Vietnam War',
  },
  waterloo: {
    img: '/images/waterloo.jpg',
    gradient: 'linear-gradient(160deg,#0B0715 0%,#170E28 100%)',
    accent: '#9B7FBA',
    era: 'MDCCCXV · The Napoleonic Wars',
  },
};

export function getMeta(id) {
  return BATTLE_META[id] || { img: '', gradient: 'linear-gradient(160deg,#07050A 0%,#110E18 100%)', accent: '#C9A84C', era: '' };
}
