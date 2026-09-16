export const LEVELS = [
  {
    level: 1,
    name: 'Rookie Runner',
    subtitle: 'Learn the dash',
    requiredXP: 0,
    unlockCost: 0,
    tier: 'LOW',
    color: '#00F0FF',
    perks: ['Basic challenges', 'Low-tier skins', 'Basic upgrades'],
  },
  {
    level: 2,
    name: 'Neon Strider',
    subtitle: 'Find your rhythm',
    requiredXP: 500,
    unlockCost: 250,
    tier: 'LOW',
    color: '#22D3EE',
    perks: ['Extra Jump access', 'More challenge types', 'Tier 2 skins'],
  },
  {
    level: 3,
    name: 'Hazard Hunter',
    subtitle: 'The city fights back',
    requiredXP: 1500,
    unlockCost: 500,
    tier: 'MEDIUM',
    color: '#A855F7',
    perks: ['Medium challenges', 'Medium shop economy', 'Advanced upgrades'],
  },
  {
    level: 4,
    name: 'Gravity Breaker',
    subtitle: 'Own the air',
    requiredXP: 3000,
    unlockCost: 900,
    tier: 'MEDIUM',
    color: '#F472B6',
    perks: ['Gravity challenges', 'Rare skins', 'High-value XP tasks'],
  },
  {
    level: 5,
    name: 'Cyber Vanguard',
    subtitle: 'Enter the elite circuit',
    requiredXP: 5000,
    unlockCost: 1400,
    tier: 'HIGH',
    color: '#F59E0B',
    perks: ['High-tier challenges', 'Elite upgrades', 'Premium skins'],
  },
  {
    level: 6,
    name: 'Dash Legend',
    subtitle: 'No road is too dangerous',
    requiredXP: 8000,
    unlockCost: 2000,
    tier: 'HIGH',
    color: '#FFD700',
    perks: ['Legend challenges', 'Legendary skins', 'Maximum upgrade access'],
  },
];

export const MAX_LEVEL = LEVELS.length;

export function getLevelDefinition(level) {
  return LEVELS.find((item) => item.level === level) || LEVELS[0];
}

export function getNextLevel(level) {
  return LEVELS.find((item) => item.level === level + 1) || null;
}

export function canAccessLevel(save, level) {
  const target = getLevelDefinition(level);
  if (!target) return false;
  return Number(save?.totalXP || 0) >= target.requiredXP;
}
