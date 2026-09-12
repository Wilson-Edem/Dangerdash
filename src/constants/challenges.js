// 30 static challenges — 3 random ones drawn per day
export const CHALLENGES = [
  { id: 'c01', text: 'Collect 30 coins in one run', type: 'coins_in_run', target: 30, reward: 100 },
  { id: 'c02', text: 'Collect 50 coins in one run', type: 'coins_in_run', target: 50, reward: 200 },
  { id: 'c03', text: 'Reach 500 score', type: 'score_run', target: 500, reward: 100 },
  { id: 'c04', text: 'Reach 1000 score', type: 'score_run', target: 1000, reward: 250 },
  { id: 'c05', text: 'Reach 2000 score', type: 'score_run', target: 2000, reward: 500 },
  { id: 'c06', text: 'Play 3 runs today', type: 'runs_played', target: 3, reward: 50 },
  { id: 'c07', text: 'Play 5 runs today', type: 'runs_played', target: 5, reward: 100 },
  { id: 'c08', text: 'Activate 5 power-ups', type: 'powerups_used', target: 5, reward: 150 },
  { id: 'c09', text: 'Activate 10 power-ups', type: 'powerups_used', target: 10, reward: 300 },
  { id: 'c10', text: 'Reach a 10x combo', type: 'combo_max', target: 10, reward: 150 },
  { id: 'c11', text: 'Reach a 20x combo', type: 'combo_max', target: 20, reward: 400 },
  { id: 'c12', text: 'Survive 30 seconds', type: 'survive_frames', target: 1800, reward: 100 },
  { id: 'c13', text: 'Survive 60 seconds', type: 'survive_frames', target: 3600, reward: 300 },
  { id: 'c14', text: 'Collect 5 power orbs in one run', type: 'orbs_in_run', target: 5, reward: 200 },
  { id: 'c15', text: 'Pick up a shield', type: 'shield_pickups', target: 1, reward: 50 },
  { id: 'c16', text: 'Pick up 3 shields today', type: 'shield_pickups', target: 3, reward: 200 },
  { id: 'c17', text: 'Die 3 times', type: 'deaths', target: 3, reward: 50 },
  { id: 'c18', text: 'Die 10 times', type: 'deaths', target: 10, reward: 150 },
  { id: 'c19', text: 'Collect 200 total coins', type: 'total_coins', target: 200, reward: 200 },
  { id: 'c20', text: 'Collect 500 total coins', type: 'total_coins', target: 500, reward: 500 },
  { id: 'c21', text: 'Reach 3000 score', type: 'score_run', target: 3000, reward: 800 },
  { id: 'c22', text: 'Reach 5000 score', type: 'score_run', target: 5000, reward: 1500 },
  { id: 'c23', text: 'Land 100 jumps in one day', type: 'jumps_total', target: 100, reward: 200 },
  { id: 'c24', text: 'Use Gravity Flip 3 times', type: 'gravity_uses', target: 3, reward: 100 },
  { id: 'c25', text: 'Use Score Doubler 5 times', type: 'doubler_uses', target: 5, reward: 200 },
  { id: 'c26', text: 'Reach speed 10x', type: 'speed_max', target: 10, reward: 300 },
  { id: 'c27', text: 'Reach speed 12x', type: 'speed_max', target: 12, reward: 600 },
  { id: 'c28', text: 'Complete 5 challenges', type: 'challenges_done', target: 5, reward: 500 },
  { id: 'c29', text: 'Play 10 runs today', type: 'runs_played', target: 10, reward: 250 },
  { id: 'c30', text: 'Beat your own high score', type: 'new_high_score', target: 1, reward: 1000 },
];

// Deterministic daily pick (same 3 challenges for a given day)
export function getDailyChallenges(dateSeed) {
  const shuffled = [...CHALLENGES].sort((a, b) => {
    const ha = hash(`${dateSeed}_${a.id}`);
    const hb = hash(`${dateSeed}_${b.id}`);
    return ha - hb;
  });
  return shuffled.slice(0, 3);
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}