import {
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';

const SOUND_ASSETS = {
  /*
   * MENU MUSIC
   *
   * Played while the app is loading/booting and on
   * the main menu.
   */
  menu_theme: require(
    '../../assets/audio/music/menu_theme.mp3'
  ),

  /*
   * GAMEPLAY MUSIC
   */
  gameplay_track_1: require(
    '../../assets/audio/music/gameplay_track_1.mp3'
  ),

  gameplay_track_3: require(
    '../../assets/audio/music/gameplay_track_3.mp3'
  ),

  /*
   * SFX
   */
  ui_click: require(
    '../../assets/audio/sfx/ui_click.wav'
  ),

  jump: require(
    '../../assets/audio/sfx/jump.wav'
  ),

  power_jump: require(
    '../../assets/audio/sfx/power_jump.wav'
  ),

  coin_pickup: require(
    '../../assets/audio/sfx/coin_pickup.wav'
  ),

  powerup: require(
    '../../assets/audio/sfx/powerup.wav'
  ),

  shield_hit: require(
    '../../assets/audio/sfx/shield_hit.wav'
  ),

  heart_lost: require(
    '../../assets/audio/sfx/heart_lost.wav'
  ),

  boost_pad: require(
    '../../assets/audio/sfx/boost_pad.wav'
  ),

  water_splash: require(
    '../../assets/audio/sfx/water_splash.wav'
  ),

  game_over: require(
    '../../assets/audio/sfx/game_over.wav'
  ),
};

/*
 * These are the ONLY tracks used during gameplay.
 *
 * Note that the actual filename is gameplay_track_3,
 * not gameplay_track_2.
 */
const GAMEPLAY_TRACKS = [
  'gameplay_track_1',
  'gameplay_track_3',
];

const MUSIC_KEYS = new Set([
  'menu_theme',
  ...GAMEPLAY_TRACKS,
]);

const sfxPlayers = {};

let musicPlayer = null;

let musicSubscription = null;

let currentMusicKey = null;

let currentMusicGroup = null;

let isPreloaded = false;

/*
 * Shuffle bag.
 *
 * Instead of doing Math.random() every time, we create a
 * shuffled queue and consume it.
 *
 * With two tracks this guarantees that both tracks are
 * played before the queue is reshuffled.
 */
let gameplayQueue = [];

/*
 * Used to invalidate old playback callbacks when music
 * changes or stops.
 */
let musicGeneration = 0;

let flags = {
  musicOn: true,
  soundOn: true,
};

function shuffle(array) {
  const result = [
    ...array,
  ];

  for (
    let i =
      result.length - 1;
    i > 0;
    i -= 1
  ) {
    const j =
      Math.floor(
        Math.random() *
          (i + 1)
      );

    [
      result[i],
      result[j],
    ] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

function getNextGameplayTrack() {
  if (
    gameplayQueue.length ===
    0
  ) {
    gameplayQueue =
      shuffle(
        GAMEPLAY_TRACKS
      );
  }

  return gameplayQueue.shift();
}

function removeMusicListener() {
  if (!musicSubscription) {
    return;
  }

  try {
    musicSubscription.remove();
  } catch (e) {}

  musicSubscription = null;
}

function releasePlayer(player) {
  try {
    if (
      typeof player.release ===
      'function'
    ) {
      player.release();
    } else if (
      typeof player.remove ===
      'function'
    ) {
      player.remove();
    }
  } catch (e) {}
}

function stopAndReleasePlayer(
  player
) {
  try {
    player.pause();
  } catch (e) {}

  releasePlayer(player);
}

export function setAudioFlags(
  next
) {
  flags = {
    ...flags,
    ...next,
  };

  if (
    !flags.musicOn &&
    musicPlayer
  ) {
    try {
      musicPlayer.pause();
    } catch (e) {}
  } else if (
    flags.musicOn &&
    musicPlayer &&
    currentMusicKey
  ) {
    try {
      musicPlayer.play();
    } catch (e) {}
  }
}

export async function initAudioSession() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode:
        'doNotMix',
    });
  } catch (e) {
    console.warn(
      'Audio session init failed:',
      e
    );
  }
}

export async function preloadAllAudio() {
  if (isPreloaded) {
    return;
  }

  isPreloaded = true;

  /*
   * Preload SFX.
   *
   * Music is created when it is actually needed.
   */
  for (
    const key of Object.keys(
      SOUND_ASSETS
    )
  ) {
    if (
      MUSIC_KEYS.has(key)
    ) {
      continue;
    }

    try {
      const player =
        createAudioPlayer(
          SOUND_ASSETS[key]
        );

      player.volume = 0.8;

      sfxPlayers[key] =
        player;
    } catch (e) {
      console.warn(
        `SFX preload failed (${key}):`,
        e
      );
    }
  }
}

export function playSFX(
  key
) {
  if (!flags.soundOn) {
    return;
  }

  const player =
    sfxPlayers[key];

  if (!player) {
    return;
  }

  try {
    player.seekTo(0);
    player.play();
  } catch (e) {}
}

export async function playMusic(
  key,
  fadeMs = 800
) {
  if (!flags.musicOn) {
    return;
  }

  /*
   * A gameplay key means:
   *
   * "start/resume the gameplay music system"
   *
   * rather than:
   *
   * "always play track 1".
   */
  const isGameplayTrack =
    GAMEPLAY_TRACKS.includes(
      key
    );

  const requestedGroup =
    isGameplayTrack
      ? 'gameplay'
      : key === 'menu_theme'
        ? 'menu'
        : key;

  let selectedKey = key;

  if (
    requestedGroup ===
    'gameplay'
  ) {
    selectedKey =
      getNextGameplayTrack();
  }

  /*
   * Do not recreate an already playing menu track.
   */
  if (
    currentMusicKey ===
      selectedKey &&
    musicPlayer &&
    currentMusicGroup ===
      requestedGroup
  ) {
    return;
  }

  const previousPlayer =
    musicPlayer;

  /*
   * Invalidate the old listener before replacing
   * the current player.
   */
  musicGeneration += 1;

  const thisGeneration =
    musicGeneration;

  musicPlayer = null;

  currentMusicKey =
    null;

  currentMusicGroup =
    null;

  removeMusicListener();

  /*
   * Fade out the previous track.
   */
  if (previousPlayer) {
    fadeVolume(
      previousPlayer,
      previousPlayer.volume ||
        0,
      0,
      fadeMs / 2,
      () =>
        stopAndReleasePlayer(
          previousPlayer
        )
    );
  }

  const asset =
    SOUND_ASSETS[
      selectedKey
    ];

  if (!asset) {
    return;
  }

  try {
    const player =
      createAudioPlayer(
        asset
      );

    /*
     * MENU:
     * loop forever.
     *
     * GAMEPLAY:
     * do NOT loop. The playback listener below
     * starts another shuffled gameplay track.
     */
    player.loop =
      requestedGroup ===
      'menu';

    player.volume = 0;

    musicPlayer =
      player;

    currentMusicKey =
      selectedKey;

    currentMusicGroup =
      requestedGroup;

    /*
     * Automatically advance through the shuffled
     * gameplay queue when the current song finishes.
     */
    if (
      requestedGroup ===
      'gameplay'
    ) {
      musicSubscription =
        player.addListener(
          'playbackStatusUpdate',
          (status) => {
            if (
              thisGeneration !==
                musicGeneration ||
              musicPlayer !==
                player ||
              requestedGroup !==
                'gameplay'
            ) {
              return;
            }

            if (
              status.didJustFinish
            ) {
              removeMusicListener();

              /*
               * This requests another gameplay track.
               * The shuffle bag decides which one.
               */
              playMusic(
                'gameplay_track_1',
                500
              ).catch(
                () => {}
              );
            }
          }
        );
    }

    player.play();

    fadeVolume(
      player,
      0,
      0.5,
      fadeMs
    );
  } catch (e) {
    console.warn(
      `Music playback failed (${selectedKey}):`,
      e
    );
  }
}

export function stopMusic(
  fadeMs = 600
) {
  if (!musicPlayer) {
    return;
  }

  /*
   * Invalidate any finish callback.
   */
  musicGeneration += 1;

  const player =
    musicPlayer;

  musicPlayer = null;

  currentMusicKey =
    null;

  currentMusicGroup =
    null;

  removeMusicListener();

  fadeVolume(
    player,
    player.volume ||
      0.5,
    0,
    fadeMs,
    () =>
      stopAndReleasePlayer(
        player
      )
  );
}

export function setMusicSpeedSync(
  currentSpeed
) {
  if (!musicPlayer) {
    return;
  }

  try {
    const ratio =
      Math.min(
        currentSpeed / 14.0,
        1
      );

    const rate =
      1 +
      ratio * 0.15;

    if (
      typeof musicPlayer.setPlaybackRate ===
      'function'
    ) {
      musicPlayer.setPlaybackRate(
        rate
      );
    }
  } catch (e) {}
}

function fadeVolume(
  player,
  from,
  to,
  durationMs,
  onComplete
) {
  if (
    durationMs <= 0
  ) {
    try {
      player.volume =
        to;
    } catch (e) {}

    if (onComplete) {
      onComplete();
    }

    return;
  }

  const steps = 20;

  const stepDuration =
    durationMs / steps;

  const delta =
    (to - from) /
    steps;

  let current = from;

  let step = 0;

  const timer =
    setInterval(
      () => {
        step += 1;

        current += delta;

        try {
          player.volume =
            Math.max(
              0,
              Math.min(
                1,
                current
              )
            );
        } catch (e) {}

        if (
          step >= steps
        ) {
          clearInterval(
            timer
          );

          if (
            onComplete
          ) {
            onComplete();
          }
        }
      },
      stepDuration
    );
}
