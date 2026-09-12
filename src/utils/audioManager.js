import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { GAME_CONFIG } from '../constants/gameConfig';

const SOUND_ASSETS = {
  menu_theme: require('../../assets/audio/music/menu_theme.mp3'),
  gameplay_track_1: require('../../assets/audio/music/gameplay_track_1.mp3'),
  gameplay_track_2: require('../../assets/audio/music/gameplay_track_2.mp3'),

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

const MUSIC_TRACKS = ['menu_theme', 'gameplay_track_1', 'gameplay_track_2'];

const sfxPlayers = {};
let musicPlayer = null;
let currentMusicKey = null;
let isPreloaded = false;

export async function initAudioSession() {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  } catch (e) {}
}

export async function preloadAllAudio() {
  if (isPreloaded) return;
  isPreloaded = true;
  for (const key of Object.keys(SOUND_ASSETS)) {
    if (MUSIC_TRACKS.includes(key)) continue;
    try {
      const player = createAudioPlayer(SOUND_ASSETS[key]);
      player.volume = 0.8;
      sfxPlayers[key] = player;
    } catch (e) {}
  }
}

export function playSFX(key) {
  const player = sfxPlayers[key];
  if (!player) return;
  try {
    player.seekTo(0);
    player.play();
  } catch (e) {}
}

// Crossfade into a new music track
export async function playMusic(key, fadeMs = GAME_CONFIG.MUSIC_FADE_IN_MS) {
  if (currentMusicKey === key && musicPlayer) return;

  // Fade out existing music first
  if (musicPlayer) {
    const oldPlayer = musicPlayer;
    musicPlayer = null;
    currentMusicKey = null;
    fadeVolume(oldPlayer, oldPlayer.volume || 0, 0, fadeMs / 2, () => {
      try {
        oldPlayer.pause();
        oldPlayer.remove();
      } catch (e) {}
    });
  }

  const asset = SOUND_ASSETS[key];
  if (!asset) return;

  try {
    const player = createAudioPlayer(asset);
    player.loop = true;
    player.volume = 0;
    player.play();
    musicPlayer = player;
    currentMusicKey = key;
    fadeVolume(player, 0, GAME_CONFIG.MUSIC_BASE_VOLUME, fadeMs);
  } catch (e) {}
}

export function stopMusic(fadeMs = GAME_CONFIG.MUSIC_FADE_OUT_MS) {
  if (!musicPlayer) return;
  const p = musicPlayer;
  musicPlayer = null;
  currentMusicKey = null;
  fadeVolume(p, p.volume || GAME_CONFIG.MUSIC_BASE_VOLUME, 0, fadeMs, () => {
    try {
      p.pause();
      p.remove();
    } catch (e) {}
  });
}

// Speed-synced music: rate 1.0 → 1.15 based on game speed
export function setMusicSpeedSync(currentSpeed) {
  if (!musicPlayer) return;
  try {
    const ratio = Math.min(currentSpeed / GAME_CONFIG.MAX_SPEED, 1);
    const rate = 1 + ratio * (GAME_CONFIG.MUSIC_MAX_RATE - 1);
    if (typeof musicPlayer.setPlaybackRate === 'function') {
      musicPlayer.setPlaybackRate(rate);
    }
  } catch (e) {}
}

function fadeVolume(player, from, to, durationMs, onComplete) {
  if (durationMs <= 0) {
    try { player.volume = to; } catch (e) {}
    if (onComplete) onComplete();
    return;
  }
  const steps = 20;
  const stepDuration = durationMs / steps;
  const delta = (to - from) / steps;
  let current = from;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current += delta;
    try {
      player.volume = Math.max(0, Math.min(1, current));
    } catch (e) {}
    if (step >= steps) {
      clearInterval(timer);
      if (onComplete) onComplete();
    }
  }, stepDuration);
}