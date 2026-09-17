import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getXPForScore,
  getLevelFromXP,
} from '../constants/gameConfig';


const KEY =
  '@danger_dash_save_v1';


const DEFAULT_SAVE = {
  totalCoins: 0,

  highScore: 0,

  /*
   * Player progression.
   */
  xp: 0,

  level: 1,

  ownedSkins: [
    'default',
  ],

  equippedSkin:
    'default',

  upgrades: {
    extra_jump: 0,
    magnet_range: 0,
    slow_fall: 0,
  },

  runLog: [],

  /*
   * Daily challenge progress.
   */
  challengeProgress: {},

  challengeProgressDate: '',

  challengeClaimedDate: '',

  challengeCompletedIds: [],

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


/*
 * Use the device's local calendar date.
 */
function getLocalDateKey() {
  const d = new Date();

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}


/*
 * Load the saved player data.
 *
 * This also migrates older DangerDash saves that
 * did not contain XP/level yet.
 */
export async function loadSave() {
  const today =
    getLocalDateKey();


  /*
   * Cached save.
   */
  if (cachedSave) {
    if (
      cachedSave.challengeProgressDate !==
      today
    ) {
      cachedSave = {
        ...cachedSave,

        challengeProgress: {},

        challengeCompletedIds: [],

        challengeNotificationIds: [],

        challengeProgressDate:
          today,
      };

      try {
        await AsyncStorage.setItem(
          KEY,
          JSON.stringify(
            cachedSave
          )
        );
      } catch (e) {}
    }

    return cachedSave;
  }


  try {
    const raw =
      await AsyncStorage.getItem(
        KEY
      );


    /*
     * Brand-new player.
     */
    if (!raw) {
      cachedSave = {
        ...DEFAULT_SAVE,

        challengeProgressDate:
          today,
      };

      return cachedSave;
    }


    const parsed =
      JSON.parse(raw);


    /*
     * Existing player's high score.
     */
    const storedHighScore =
      Math.max(
        0,
        Number(
          parsed.highScore || 0
        )
      );


    /*
     * If the player already had a high score
     * before the XP system existed, give them
     * the XP represented by that high score.
     */
    const storedXP =
      Math.max(
        getXPForScore(
          storedHighScore
        ),
        Number(
          parsed.xp || 0
        )
      );


    cachedSave = {
      ...DEFAULT_SAVE,

      ...parsed,

      xp: storedXP,

      level:
        getLevelFromXP(
          storedXP
        ),

      challengeNotificationIds:
        parsed.challengeNotificationIds ||
        [],
    };


    /*
     * Daily challenges reset on a new date.
     */
    if (
      cachedSave.challengeProgressDate !==
      today
    ) {
      cachedSave.challengeProgress =
        {};

      cachedSave.challengeCompletedIds =
        [];

      cachedSave.challengeNotificationIds =
        [];

      cachedSave.challengeProgressDate =
        today;

      await AsyncStorage.setItem(
        KEY,
        JSON.stringify(
          cachedSave
        )
      );
    }


    return cachedSave;
  } catch (e) {
    cachedSave = {
      ...DEFAULT_SAVE,

      challengeProgressDate:
        today,
    };

    return cachedSave;
  }
}


/*
 * Write part of the save.
 */
export async function writeSave(
  partial
) {
  cachedSave = {
    ...(cachedSave ||
      DEFAULT_SAVE),

    ...partial,
  };


  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify(
        cachedSave
      )
    );
  } catch (e) {}


  return cachedSave;
}


/*
 * Add coins.
 */
export async function addCoins(
  amount
) {
  const save =
    await loadSave();

  return writeSave({
    totalCoins:
      save.totalCoins +
      amount,
  });
}


/*
 * Spend coins.
 */
export async function spendCoins(
  amount
) {
  const save =
    await loadSave();


  if (
    save.totalCoins <
    amount
  ) {
    return false;
  }


  await writeSave({
    totalCoins:
      save.totalCoins -
      amount,
  });


  return true;
}


/*
 * Unlock a skin.
 */
export async function unlockSkin(
  skinId,
  price
) {
  const save =
    await loadSave();


  if (
    save.ownedSkins.includes(
      skinId
    )
  ) {
    return true;
  }


  if (
    save.totalCoins <
    price
  ) {
    return false;
  }


  await writeSave({
    totalCoins:
      save.totalCoins -
      price,

    ownedSkins: [
      ...save.ownedSkins,
      skinId,
    ],
  });


  return true;
}


/*
 * Equip a skin.
 */
export async function equipSkin(
  skinId
) {
  await writeSave({
    equippedSkin:
      skinId,
  });
}


/*
 * Buy an upgrade.
 */
export async function buyUpgrade(
  upgradeId,
  cost,
  currentLevel
) {
  const save =
    await loadSave();


  if (
    save.totalCoins <
    cost
  ) {
    return false;
  }


  await writeSave({
    totalCoins:
      save.totalCoins -
      cost,

    upgrades: {
      ...save.upgrades,

      [upgradeId]:
        currentLevel + 1,
    },
  });


  return true;
}


/*
 * Record the completed run.
 *
 * XP is awarded ONLY when the player's
 * personal high score increases.
 *
 * Example:
 *
 * Old high score = 2000
 * New high score = 3000
 *
 * Old score XP = 20
 * New score XP = 30
 *
 * XP earned = +10
 */
export async function recordRun(
  score,
  coins
) {
  const save =
    await loadSave();


  const newLog = [
    {
      score,
      coins,
      date: Date.now(),
    },

    ...save.runLog,
  ].slice(
    0,
    10
  );


  const safeScore =
    Math.max(
      0,
      Number(score) || 0
    );


  const previousHighScore =
    Math.max(
      0,
      Number(
        save.highScore || 0
      )
    );


  const isHigh =
    safeScore >
    previousHighScore;


  const nextHighScore =
    isHigh
      ? safeScore
      : previousHighScore;


  /*
   * XP represented by the old high score.
   */
  const previousScoreXP =
    getXPForScore(
      previousHighScore
    );


  /*
   * XP represented by the new high score.
   */
  const nextScoreXP =
    getXPForScore(
      nextHighScore
    );


  /*
   * Only the newly crossed score milestones
   * are awarded.
   */
  const xpEarned =
    Math.max(
      0,
      nextScoreXP -
        previousScoreXP
    );


  const nextXP =
    Math.max(
      0,
      Number(
        save.xp || 0
      )
    ) +
    xpEarned;


  const nextLevel =
    getLevelFromXP(
      nextXP
    );


  await writeSave({
    totalCoins:
      save.totalCoins +
      coins,

    highScore:
      nextHighScore,

    xp:
      nextXP,

    level:
      nextLevel,

    runLog:
      newLog,

    totalRunsPlayed:
      save.totalRunsPlayed +
      1,
  });


  return isHigh;
}


/*
 * Get the in-memory save without another
 * AsyncStorage request.
 */
export function getCachedSave() {
  return (
    cachedSave ||
    DEFAULT_SAVE
  );
}
