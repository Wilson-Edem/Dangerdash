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

  GRAVITY: 1.0,

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

  PLAYER_WIDTH: 50,

  PLAYER_HEIGHT: 66,

  MAX_HEALTH: 3,

  INVINCIBILITY_FRAMES: 60,

  // =========================
  // JUMP
  // =========================

  JUMP_FORCE: -15.5,

  POWER_JUMP_FORCE: -25.0,

  MAX_MIDAIR_JUMPS: 1,

  DOUBLE_TAP_WINDOW: 300,

  POWER_JUMP_COOLDOWN: 400,

  // =========================
  // PLATFORMS
  // =========================

  /*
   * 225 / 450 = 50%.
   *
   * The platform surface is therefore exactly halfway
   * down the virtual game canvas.
   */
  GROUND_Y: 225,

  PLATFORM_HEIGHT: 180,

  MIN_PLATFORM_WIDTH: 180,

  MAX_PLATFORM_WIDTH: 420,

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
  // COMBO
  // =========================

  COMBO_TIMEOUT_FRAMES: 300,

  COMBO_SCORE_BONUS: 0.2,

  // =========================
  // WATER
  // =========================

  /*
   * Raised from 340 to 315 so the water is visibly higher
   * and a falling player reaches it shortly after leaving
   * a platform.
   */
  WATER_LEVEL_Y: 315,

  FALL_DEATH_Y: 365,

  MUSIC_BASE_VOLUME: 0.5,

  MUSIC_FADE_IN_MS: 800,

  MUSIC_FADE_OUT_MS: 600,

  MUSIC_MAX_RATE: 1.15,
};