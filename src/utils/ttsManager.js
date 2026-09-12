import * as Speech from 'expo-speech';

let lastSpokenAt = 0;
const MIN_GAP_MS = 2500; // Prevent rapid-fire quips

export function speakQuip(text, options = {}) {
  if (!text) return;
  const now = Date.now();
  if (now - lastSpokenAt < MIN_GAP_MS && !options.force) return;
  lastSpokenAt = now;

  try {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.1,
      rate: 1.05,
      ...options,
    });
  } catch (e) {
    // TTS failures should never crash the game
  }
}

export function stopSpeech() {
  try {
    Speech.stop();
  } catch (e) {}
}