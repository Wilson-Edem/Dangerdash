import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS, MAX_LEVEL, getLevelDefinition } from '../constants/levels';

const KEY = '@danger_dash_save_v1';

const DEFAULT_SAVE = {
  totalCoins: 0,
  highScore: 0,
  totalXP: 0,
  xp: 0,
  currentLevel: 1,
  unlockedLevels: [1],
  ownedSkins: ['default'],
  equippedSkin: 'default',
  upgrades: {
    extra_jump: 0,
    magnet_range: 0,
    slow_fall: 0,
    coin_yield: 0,
    xp_catalyst: 0,
    challenge_bonus: 0,
    elite_magnet: 0,
    legendary_fall: 0,
  },
  runLog: [],
  challengeProgress: {},
  challengeProgressDate: '',
  challengeClaimedDate: '',
  challengeCompletedIds: [],
  challengeXpAwardedIds: [],
  challengeNotificationIds: [],
  totalRunsPlayed: 0,
  totalJumps: 0,
  totalShieldPickups: 0,
  settings: {
    soundOn: true,
    musicOn: true,
    vibrationOn: true,
  },
};

let cachedSave = null;

function getLocalDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function normalizeSave(parsed = {}) {
  const merged = {
    ...DEFAULT_SAVE,
    ...parsed,
    upgrades: {
      ...DEFAULT_SAVE.upgrades,
      ...(parsed.upgrades || {}),
    },
    settings: {
      ...DEFAULT_SAVE.settings,
      ...(parsed.settings || {}),
    },
    ownedSkins: Array.isArray(parsed.ownedSkins) ? parsed.ownedSkins : ['default'],
    unlockedLevels: Array.isArray(parsed.unlockedLevels) && parsed.unlockedLevels.length
      ? parsed.unlockedLevels
      : [1],
    challengeCompletedIds: Array.isArray(parsed.challengeCompletedIds) ? parsed.challengeCompletedIds : [],
    challengeXpAwardedIds: Array.isArray(parsed.challengeXpAwardedIds) ? parsed.challengeXpAwardedIds : [],
    challengeNotificationIds: Array.isArray(parsed.challengeNotificationIds) ? parsed.challengeNotificationIds : [],
  };

  merged.currentLevel = Math.max(1, Math.min(MAX_LEVEL, Number(merged.currentLevel || 1)));
  merged.totalXP = Math.max(0, Number(merged.totalXP || 0));
  merged.xp = Math.max(0, Number(merged.xp || 0));

  const validUnlocked = merged.unlockedLevels
    .map(Number)
    .filter((level) => level >= 1 && level <= MAX_LEVEL);

  merged.unlockedLevels = [...new Set([1, ...validUnlocked])].sort((a, b) => a - b);
  merged.currentLevel = Math.max(...merged.unlockedLevels);

  return merged;
}

async function persist() {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(cachedSave));
  } catch (e) {}
}

export async function loadSave() {
  const today = getLocalDateKey();

  if (cachedSave) {
    if (cachedSave.challengeProgressDate !== today) {
      cachedSave = {
        ...cachedSave,
        challengeProgress: {},
        challengeCompletedIds: [],
        challengeXpAwardedIds: [],
        challengeNotificationIds: [],
        challengeProgressDate: today,
        challengeClaimedDate: '',
      };
      await persist();
    }
    return cachedSave;
  }

  try {
    const raw = await AsyncStorage.getItem(KEY);

    if (!raw) {
      cachedSave = {
        ...DEFAULT_SAVE,
        challengeProgressDate: today,
      };
      return cachedSave;
    }

    cachedSave = normalizeSave(JSON.parse(raw));

    if (cachedSave.challengeProgressDate !== today) {
      cachedSave.challengeProgress = {};
      cachedSave.challengeCompletedIds = [];
      cachedSave.challengeXpAwardedIds = [];
      cachedSave.challengeNotificationIds = [];
      cachedSave.challengeProgressDate = today;
      cachedSave.challengeClaimedDate = '';
      await persist();
    }

    return cachedSave;
  } catch (e) {
    cachedSave = {
      ...DEFAULT_SAVE,
      challengeProgressDate: today,
    };
    return cachedSave;
  }
}

export async function writeSave(partial) {
  const base = cachedSave || DEFAULT_SAVE;
  cachedSave = normalizeSave({ ...base, ...partial });
  await persist();
  return cachedSave;
}

export async function addCoins(amount) {
  const save = await loadSave();
  return writeSave({ totalCoins: save.totalCoins + Math.max(0, Number(amount || 0)) });
}

export async function spendCoins(amount) {
  const save = await loadSave();
  const value = Math.max(0, Number(amount || 0));
  if (save.totalCoins < value) return false;
  await writeSave({ totalCoins: save.totalCoins - value });
  return true;
}

export async function unlockSkin(skinId, price, minLevel = 1) {
  const save = await loadSave();

  if (save.currentLevel < minLevel) return false;
  if (save.ownedSkins.includes(skinId)) return true;

  const value = Math.max(0, Number(price || 0));
  if (save.totalCoins < value) return false;

  await writeSave({
    totalCoins: save.totalCoins - value,
    ownedSkins: [...save.ownedSkins, skinId],
  });

  return true;
}

export async function equipSkin(skinId) {
  const save = await loadSave();
  if (!save.ownedSkins.includes(skinId)) return false;
  await writeSave({ equippedSkin: skinId });
  return true;
}

export async function buyUpgrade(upgradeId, cost, currentLevel, minLevel = 1) {
  const save = await loadSave();

  if (save.currentLevel < minLevel) return false;
  if (save.totalCoins < cost) return false;

  const upgrades = {
    ...save.upgrades,
    [upgradeId]: currentLevel + 1,
  };

  // Elite upgrades build on the core upgrades already used by the runner.
  if (upgradeId === 'elite_magnet') {
    upgrades.magnet_range = Math.min(8, Number(save.upgrades.magnet_range || 0) + 1);
  }

  if (upgradeId === 'legendary_fall') {
    upgrades.slow_fall = Math.min(8, Number(save.upgrades.slow_fall || 0) + 1);
  }

  await writeSave({
    totalCoins: save.totalCoins - cost,
    upgrades,
  });

  return true;
}

export async function addXP(amount) {
  const save = await loadSave();
  const value = Math.max(0, Math.floor(Number(amount || 0)));

  if (!value) return save;

  return writeSave({
    xp: save.xp + value,
    totalXP: save.totalXP + value,
  });
}

export async function spendXP(amount) {
  const save = await loadSave();
  const value = Math.max(0, Math.floor(Number(amount || 0)));

  if (save.xp < value) return false;

  await writeSave({ xp: save.xp - value });
  return true;
}

export async function unlockNextLevel() {
  const save = await loadSave();
  const nextLevel = save.currentLevel + 1;

  if (nextLevel > MAX_LEVEL) {
    return { ok: false, reason: 'MAX_LEVEL', save };
  }

  const definition = getLevelDefinition(nextLevel);

  if (save.totalXP < definition.requiredXP) {
    return { ok: false, reason: 'XP_REQUIREMENT', save };
  }

  if (save.xp < definition.unlockCost) {
    return { ok: false, reason: 'XP_COST', save };
  }

  const unlockedLevels = [...new Set([...save.unlockedLevels, nextLevel])].sort((a, b) => a - b);

  const updated = await writeSave({
    xp: save.xp - definition.unlockCost,
    currentLevel: nextLevel,
    unlockedLevels,
  });

  return { ok: true, save: updated };
}

export async function recordRun(score, coins) {
  const save = await loadSave();
  const safeCoins = Math.max(0, Number(coins || 0));
  const coinBonus = Math.max(0, Number(save.upgrades.coin_yield || 0));

  const newLog = [
    { score, coins: safeCoins, date: Date.now() },
    ...save.runLog,
  ].slice(0, 10);

  const isHigh = score > save.highScore;

  await writeSave({
    totalCoins: save.totalCoins + safeCoins + coinBonus,
    highScore: isHigh ? score : save.highScore,
    runLog: newLog,
    totalRunsPlayed: save.totalRunsPlayed + 1,
  });

  return isHigh;
}

export function getCachedSave() {
  return cachedSave || DEFAULT_SAVE;
}

export { DEFAULT_SAVE, LEVELS };
