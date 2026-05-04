// Historical photos from Wikimedia Commons (public domain)
// Gradient is always visible as fallback if image fails to load
export const BATTLE_META = {
  stalingrad: {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Bundesarchiv_Bild_183-R74190%2C_Russland%2C_Kampf_um_Stalingrad%2C_Infanterie.jpg/800px-Bundesarchiv_Bild_183-R74190%2C_Russland%2C_Kampf_um_Stalingrad%2C_Infanterie.jpg',
    gradient: 'linear-gradient(160deg,#1a0505 0%,#2d1010 100%)',
    accent: '#ef4444',
    era: 'World War II · Eastern Front',
  },
  dday: {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg/800px-Into_the_Jaws_of_Death_23-0455M_edit.jpg',
    gradient: 'linear-gradient(160deg,#050d1a 0%,#0a1f3d 100%)',
    accent: '#60a5fa',
    era: 'World War II · Western Front',
  },
  'battle-of-britain': {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Supermarine-Spitfire_1.jpg/800px-Supermarine-Spitfire_1.jpg',
    gradient: 'linear-gradient(160deg,#07050f 0%,#12103a 100%)',
    accent: '#818cf8',
    era: 'World War II · Air War',
  },
  hiroshima: {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Atomic_bombing_of_Japan.jpg/800px-Atomic_bombing_of_Japan.jpg',
    gradient: 'linear-gradient(160deg,#1a0e00 0%,#2d1f05 100%)',
    accent: '#fbbf24',
    era: 'World War II · Pacific',
  },
  'cuban-missile-crisis': {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cuba_Missiles_1962.jpg/800px-Cuba_Missiles_1962.jpg',
    gradient: 'linear-gradient(160deg,#001a0a 0%,#032d18 100%)',
    accent: '#34d399',
    era: 'Cold War · 1962',
  },
  midway: {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Battle_of_Midway.jpg/800px-Battle_of_Midway.jpg',
    gradient: 'linear-gradient(160deg,#00101f 0%,#052033 100%)',
    accent: '#38bdf8',
    era: 'World War II · Pacific',
  },
  'pearl-harbor': {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Attack_on_Pearl_Harbor_Japanese_planes_view.jpg/800px-Attack_on_Pearl_Harbor_Japanese_planes_view.jpg',
    gradient: 'linear-gradient(160deg,#1a0000 0%,#2d0505 100%)',
    accent: '#fb7185',
    era: 'World War II · Pacific',
  },
  'berlin-1945': {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Reichstag_after_WWII_-_1945.jpg/800px-Reichstag_after_WWII_-_1945.jpg',
    gradient: 'linear-gradient(160deg,#0a0a0a 0%,#1c1c1c 100%)',
    accent: '#d1d5db',
    era: 'World War II · Final Days',
  },
  'tet-offensive': {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/A_group_of_South_Vietnamese_rangers_in_a_fire_fight_during_the_Tet_Offensive_in_Saigon%2C_1968.jpg/800px-A_group_of_South_Vietnamese_rangers_in_a_fire_fight_during_the_Tet_Offensive_in_Saigon%2C_1968.jpg',
    gradient: 'linear-gradient(160deg,#0d1700 0%,#1a2d00 100%)',
    accent: '#a3e635',
    era: 'Vietnam War · 1968',
  },
  waterloo: {
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Clément-Auguste_Andrieux_-_La_bataille_de_Waterloo.jpg/800px-Clément-Auguste_Andrieux_-_La_bataille_de_Waterloo.jpg',
    gradient: 'linear-gradient(160deg,#0e0a1a 0%,#1e1530 100%)',
    accent: '#c084fc',
    era: 'Napoleonic Wars · 1815',
  },
};

export function getMeta(id) {
  return BATTLE_META[id] || { gradient: 'linear-gradient(160deg,#111 0%,#222 100%)', accent: '#f59e0b', era: '' };
}
