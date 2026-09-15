import {
  createAudioPlayer,
  setAudioModeAsync,
} from 'expo-audio';

const SOUND_ASSETS = {
  menu_theme: require('../../assets/audio/music/menu_theme.mp3'),
  gameplay_track_1: require('../../assets/audio/music/gameplay_track_1.mp3'),
  gameplay_track_2: require('../../assets/audio/music/gameplay_track_3.mp3'),

  ui_click: require('../../assets/audio/sfx/ui_click.wav'),
  jump: require('../../assets/audio/sfx/jump.wav'),
  power_jump: require('../../assets/audio/sfx/power_jump.wav'),
  coin_pickup: require('../../assets/audio/sfx/coin_pickup.wav'),
  powerup: require('../../assets/audio/sfx/powerup.wav'),
  shield_hit: require('../../assets/audio/sfx/shield_hit.wav'),
  heart_lost: require('../../assets/audio/sfx/heart_lost.wav'),
  boost_pad: require('../../assets/audio/sfx/boost_pad.wav'),
  water_splash: require('../../assets/audio/sfx/water_splash.wav'),
  game_over: require('../../assets/audio/sfx/game_over.wav'),
};

const MUSIC_TRACKS = [
  'menu_theme',
  'gameplay_track_1',
  'gameplay_track_2',
];

const sfxPlayers = {};

let musicPlayer = null;
let currentMusicKey = null;
let isPreloaded = false;

let flags = {
  musicOn: true,
  soundOn: true,
};

export function setAudioFlags(next) {
  flags = {
    ...flags,
    ...next,
  };

  if (!flags.musicOn && musicPlayer) {
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
      interruptionMode: 'doNotMix',
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

  for (
    const key of Object.keys(SOUND_ASSETS)
  ) {
    if (MUSIC_TRACKS.includes(key)) {
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

export function playSFX(key) {
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

  if (
    currentMusicKey === key &&
    musicPlayer
  ) {
    return;
  }

  if (musicPlayer) {
    const old =
      musicPlayer;

    musicPlayer = null;
    currentMusicKey = null;

    fadeVolume(
      old,
      old.volume || 0,
      0,
      fadeMs / 2,
      () => {
        try {
          old.pause();
          old.remove();
        } catch (e) {}
      }
    );
  }

  const asset =
    SOUND_ASSETS[key];

  if (!asset) {
    return;
  }

  try {
    const player =
      createAudioPlayer(
        asset
      );

    player.loop = true;
    player.volume = 0;

    player.play();

    /*
     * No setActiveForLockScreen().
     *
     * DangerDash does not need background media playback.
     */
    musicPlayer = player;
    currentMusicKey = key;

    fadeVolume(
      player,
      0,
      0.5,
      fadeMs
    );
  } catch (e) {
    console.warn(
      `Music playback failed (${key}):`,
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

  const player =
    musicPlayer;

  musicPlayer = null;
  currentMusicKey = null;

  fadeVolume(
    player,
    player.volume || 0.5,
    0,
    fadeMs,
    () => {
      try {
        player.pause();
        player.remove();
      } catch (e) {}
    }
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
      1 + ratio * 0.15;

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
  if (durationMs <= 0) {
    try {
      player.volume = to;
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
    (to - from) / steps;

  let current = from;
  let step = 0;

  const timer =
    setInterval(() => {
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

      if (step >= steps) {
        clearInterval(timer);

        if (onComplete) {
          onComplete();
        }
      }
    }, stepDuration);
}
