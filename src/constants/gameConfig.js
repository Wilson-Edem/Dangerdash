export const GAME_CONFIG = {
  VIRTUAL_WIDTH: 800,
  VIRTUAL_HEIGHT: 450,

  STATE: {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER',
  },

  // =========================
  // PHYSICS
  // =========================

  GRAVITY: 0.95,

  FALL_GRAVITY_MULTIPLIER: 1.45,

  MAX_FALL_SPEED: 17,

  BASE_SPEED: 6.0,

  MAX_SPEED: 14.0,

  SPEED_ACCELERATION: 0.0006,

  COIN_SPEED_BONUS: 0.05,

  // =========================
  // PLAYER
  // =========================

  PLAYER_START_X: 280,

  PLAYER_START_Y: 120,

  /*
   * DO NOT REDUCE THESE.
   *
   * These are the actual game-world dimensions
   * used to render and collide with the player.
   */
  PLAYER_WIDTH: 50,

  PLAYER_HEIGHT: 66,

  MAX_HEALTH: 3,

  INVINCIBILITY_FRAMES: 60,

  // =========================
  // JUMP
  // =========================

  JUMP_FORCE: -18.0,

  POWER_JUMP_FORCE: -27.0,

  MAX_MIDAIR_JUMPS: 1,

  DOUBLE_TAP_WINDOW: 300,

  POWER_JUMP_COOLDOWN: 400,

  // =========================
  // PLATFORMS
  // =========================

  GROUND_Y: 225,

  PLATFORM_HEIGHT: 255,

  MIN_PLATFORM_WIDTH: 180,

  MAX_PLATFORM_WIDTH: 420,

  /*
   * Early-game gaps remain manageable.
   */
  STANDARD_GAP: 65,

  MAX_GAP: 115,

  SPRITE_OFFSET_Y: 8,

  // =========================
  // ITEMS
  // =========================

  ITEM_TYPES: {
    COIN: 'COIN',
    SPIKE: 'SPIKE',
    BOOST_PAD: 'BOOST_PAD',
    POWER_ORB: 'POWER_ORB',
  },

  COIN_SIZE: 34,

  SPIKE_WIDTH: 40,

  SPIKE_HEIGHT: 32,

  BOOST_PAD_WIDTH: 52,

  BOOST_PAD_HEIGHT: 18,

  POWER_ORB_SIZE: 38,

  BOOST_SPEED_MULTIPLIER: 1.4,

  // =========================
  // POWER TYPES
  // =========================

  POWER_TYPES: {
    SPEED: 'SPEED',
    FLOAT: 'FLOAT',
    MAGNET: 'MAGNET',
    SHIELD: 'SHIELD',
    GRAVITY_FLIP: 'GRAVITY_FLIP',
    SCORE_DOUBLER: 'SCORE_DOUBLER',
  },

  POWER_DURATION: {
    SPEED: 300,
    FLOAT: 300,
    MAGNET: 360,
    SHIELD: 0,
    GRAVITY_FLIP: 180,
    SCORE_DOUBLER: 300,
  },

  SPEED_POWER_BOOST: 3.5,

  FLOAT_GRAVITY_MULT: 0.45,

  FLOAT_JUMP_MULT: 0.75,

  MAGNET_RADIUS: 180,

  // =========================
  // PLAYER PROGRESSION
  // =========================

  /*
   * Every 100 score points reached on a new
   * personal high score gives 1 XP.
   *
   * Examples:
   *
   * 2000 score = 20 XP
   * 3000 score = +10 XP = 30 XP total
   * 4000 score = +10 XP = 40 XP total
   */
  XP_SCORE_STEP: 100,

  XP_PER_SCORE_STEP: 1,

  /*
   * Level unlock thresholds.
   *
   * Level 1: 0 XP
   * Level 2: 20 XP
   * Level 3: 40 XP
   * Level 4: 60 XP
   */
  LEVEL_XP: {
    LEVEL_1: 0,
    LEVEL_2: 20,
    LEVEL_3: 40,
    LEVEL_4: 60,
  },

  // =========================
  // COMBO
  // =========================

  COMBO_TIMEOUT_FRAMES: 300,

  COMBO_SCORE_BONUS: 0.2,

  // =========================
  // WATER
  // =========================

  WATER_LEVEL_Y: 365,

  FALL_DEATH_Y: 470,

  // =========================
  // AUDIO
  // =========================

  MUSIC_BASE_VOLUME: 0.5,

  MUSIC_FADE_IN_MS: 800,

  MUSIC_FADE_OUT_MS: 600,

  MUSIC_MAX_RATE: 1.15,
};


/*
 * Calculate the XP represented by a score.
 *
 * 100 score = 1 XP
 * 1000 score = 10 XP
 * 2000 score = 20 XP
 */
export function getXPForScore(score) {
  const safeScore = Math.max(
    0,
    Number(score) || 0
  );

  return (
    Math.floor(
      safeScore /
        GAME_CONFIG.XP_SCORE_STEP
    ) *
    GAME_CONFIG.XP_PER_SCORE_STEP
  );
}


/*
 * Convert XP into the player's level.
 *
 * Level 4 is the maximum unlock tier.
 * Levels above 4 keep all Level 4 abilities.
 */
export function getLevelFromXP(xp) {
  const safeXP = Math.max(
    0,
    Number(xp) || 0
  );

  if (
    safeXP >=
    GAME_CONFIG.LEVEL_XP.LEVEL_4
  ) {
    return 4;
  }

  if (
    safeXP >=
    GAME_CONFIG.LEVEL_XP.LEVEL_3
  ) {
    return 3;
  }

  if (
    safeXP >=
    GAME_CONFIG.LEVEL_XP.LEVEL_2
  ) {
    return 2;
  }

  return 1;
}


/*
 * Determine exactly what the player is allowed
 * to use at their current level.
 */
export function getLevelAccess(level) {
  const safeLevel = Math.max(
    1,
    Number(level) || 1
  );

  return {
    /*
     * Level 1 = no boost.
     * Level 2+ = boost unlocked.
     */
    canUseBoost:
      safeLevel >= 2,

    /*
     * Level 1-3 = no power orbs.
     * Level 4+ = all power-ups.
     */
    canUsePowerUps:
      safeLevel >= 4,

    /*
     * Shield is part of the Level 4 power tier.
     */
    canUseShield:
      safeLevel >= 4,

    /*
     * Level 4+ gets the complete item system.
     */
    hasAllAccess:
      safeLevel >= 4,
  };
}
