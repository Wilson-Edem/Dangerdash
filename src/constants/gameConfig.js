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

  /*
   * Player physics use virtual pixels per second.
   */
  GRAVITY: 2100,

  FALL_GRAVITY_MULTIPLIER: 1.45,

  MAX_FALL_SPEED: 1200,

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

  /*
   * Negative Y velocity means upward movement.
   */
  JUMP_FORCE: -720,

  POWER_JUMP_FORCE: -980,

  MAX_MIDAIR_JUMPS: 1,

  DOUBLE_TAP_WINDOW: 300,

  POWER_JUMP_COOLDOWN: 400,

  // =========================
  // PLATFORMS
  // =========================

  GROUND_Y: 225,

  /*
   * The platform begins at Y=225 and now continues
   * all the way to the bottom of the 450px virtual canvas.
   *
   * 450 - 225 = 225
   */
  PLATFORM_HEIGHT: 225,

  MIN_PLATFORM_WIDTH: 180,

  MAX_PLATFORM_WIDTH: 420,

  STANDARD_GAP: 65,

  MAX_GAP: 115,

  /*
   * The animation PNGs contain transparent pixels below
   * the character's feet. A 10px visual offset places the
   * visible feet directly on the platform surface.
   */
  SPRITE_OFFSET_Y: 10,

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

 
  COMBO_TIMEOUT_FRAMES: 300,

  COMBO_SCORE_BONUS: 0.2,

  WATER_SURFACE_Y: 300,

 
  WATER_LEVEL_Y: 335,

 
  FALL_DEATH_Y: 430,

  MUSIC_BASE_VOLUME: 0.5,

  MUSIC_FADE_IN_MS: 800,

  MUSIC_FADE_OUT_MS: 600,

  MUSIC_MAX_RATE: 1.15,
};