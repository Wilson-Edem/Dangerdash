import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY =
  '@danger_dash_save_v1';

const DEFAULT_SAVE = {
  totalCoins: 0,

  highScore: 0,

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

  challengeProgress: {},

  challengeProgressDate:
    '',

  challengeClaimedDate:
    '',

  challengeCompletedIds:
    [],

  /*
   * Challenges completed today but not yet claimed.
   * These IDs drive the red DAILY button badge.
   */
  challengeNotificationIds:
    [],

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
  const d =
    new Date();

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export async function loadSave() {
  const today =
    getLocalDateKey();

  if (cachedSave) {
    if (
      cachedSave.challengeProgressDate !==
      today
    ) {
      cachedSave = {
        ...cachedSave,

        challengeProgress: {},

        challengeCompletedIds:
          [],

        challengeNotificationIds:
          [],

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

    cachedSave = {
      ...DEFAULT_SAVE,
      ...parsed,

      challengeNotificationIds:
        parsed.challengeNotificationIds ||
        [],
    };

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

export async function equipSkin(
  skinId
) {
  await writeSave({
    equippedSkin:
      skinId,
  });
}

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
  ].slice(0, 10);

  const isHigh =
    score >
    save.highScore;

  await writeSave({
    totalCoins:
      save.totalCoins +
      coins,

    highScore:
      isHigh
        ? score
        : save.highScore,

    runLog:
      newLog,

    totalRunsPlayed:
      save.totalRunsPlayed +
      1,
  });

  return isHigh;
}

export function getCachedSave() {
  return (
    cachedSave ||
    DEFAULT_SAVE
  );
}