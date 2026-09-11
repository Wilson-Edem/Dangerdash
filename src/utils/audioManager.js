import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const SOUND_ASSETS = {
  // === Music (kept as .mp3 — these are large files) ===
  menu_theme: require('../../assets/audio/music/menu_theme.mp3'),
  gameplay_track_1: require('../../assets/audio/music/gameplay_track_1.mp3'),
  gameplay_track_2: require('../../assets/audio/music/gameplay_track_2.mp3'),

  // === SFX (.wav — zero-latency, matches your folder) ===
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
  } catch (error) {
    console.warn('Audio session initialization error:', error);
  }
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
    } catch (error) {
      console.warn(`Failed to preload SFX (${key}):`, error);
    }
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

export async function playMusic(key) {
  if (currentMusicKey === key && musicPlayer) return;

  if (musicPlayer) {
    try {
      musicPlayer.pause();
      musicPlayer.remove();
    } catch (e) {}
    musicPlayer = null;
    currentMusicKey = null;
  }

  const asset = SOUND_ASSETS[key];
  if (!asset) return;

  try {
    musicPlayer = createAudioPlayer(asset);
    musicPlayer.loop = true;
    musicPlayer.volume = 0;
    musicPlayer.play();
    currentMusicKey = key;
    fadeVolume(musicPlayer, 0, 0.5, 800);
  } catch (error) {
    console.warn(`Music playback error (${key}):`, error);
  }
}

export function stopMusic() {
  if (!musicPlayer) return;
  const playerToStop = musicPlayer;
  fadeVolume(playerToStop, playerToStop.volume || 0.5, 0, 400, () => {
    try {
      playerToStop.pause();
      playerToStop.remove();
    } catch (e) {}
    if (musicPlayer === playerToStop) {
      musicPlayer = null;
      currentMusicKey = null;
    }
  });
}

export function setMusicRate(rate) {
  if (musicPlayer) {
    try {
      musicPlayer.setPlaybackRate(Math.max(1.0, Math.min(rate, 1.15)));
    } catch (e) {}
  }
}

function fadeVolume(player, from, to, durationMs, onComplete) {
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