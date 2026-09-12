// Offline TTS quip library, organized by trigger category
export const QUIPS = {
  DEATH: [
    "Splash. That's gonna leave a mark.",
    "The water wins this round.",
    "You sank faster than a brick.",
    "Error four-oh-four: runner not found.",
    "Down you go, champion.",
    "That was wet. Very wet.",
    "The floor was lava. The water was worse.",
    "Better luck next reboot.",
    "Well, that escalated quickly.",
    "Back to the drawing board.",
  ],
  LONG_AIR: [
    "Nice hang time!",
    "Are you a bird?",
    "Gravity called, it wants you back.",
    "Frequent flyer miles incoming.",
    "That was a moon jump.",
    "The sky isn't the limit.",
  ],
  HIGH_SPEED: [
    "Blazing fast!",
    "You're on fire!",
    "Breaking the sound barrier!",
    "Speed demon!",
    "Feet don't fail me now!",
    "Faster than light!",
  ],
  HIGH_SCORE: [
    "New high score! Legendary!",
    "You just rewrote the record books!",
    "Unstoppable!",
    "That's a new personal best!",
    "The leaderboard bows to you.",
  ],
  COMBO_5: [
    "Combo! Nice.",
    "Five in a row!",
    "You're heating up!",
  ],
  COMBO_10: [
    "Ten combo! Unreal!",
    "You're a machine!",
    "Combo master!",
  ],
  COMBO_15: [
    "Fifteen combo! Godlike!",
    "Absolutely unstoppable!",
    "Are you even human?",
  ],
  SHIELD_SAVE: [
    "Shield saved you!",
    "That was close!",
    "Shield absorbed the hit!",
  ],
  HEART_LOST: [
    "Ouch! That hurt.",
    "You lost a heart.",
    "Watch the spikes!",
  ],
  POWER_UP: [
    "Power up!",
    "Boost activated!",
    "Cyber upgrade online!",
    "Systems enhanced!",
  ],
};

export function getRandomQuip(category) {
  const list = QUIPS[category];
  if (!list || list.length === 0) return '';
  return list[Math.floor(Math.random() * list.length)];
}