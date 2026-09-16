export const CHALLENGES = [
  { id: 'c01', text: 'Collect 15 coins in one run', type: 'coins_in_run', target: 15, reward: 80, xp: 30, minLevel: 1, tier: 'LOW' },
  { id: 'c02', text: 'Collect 25 coins in one run', type: 'coins_in_run', target: 25, reward: 140, xp: 50, minLevel: 1, tier: 'LOW' },
  { id: 'c03', text: 'Reach 250 score', type: 'score_run', target: 250, reward: 80, xp: 30, minLevel: 1, tier: 'LOW' },
  { id: 'c04', text: 'Reach 500 score', type: 'score_run', target: 500, reward: 120, xp: 45, minLevel: 1, tier: 'LOW' },
  { id: 'c05', text: 'Reach 1000 score', type: 'score_run', target: 1000, reward: 220, xp: 75, minLevel: 2, tier: 'LOW' },
  { id: 'c06', text: 'Play 2 runs today', type: 'runs_played', target: 2, reward: 50, xp: 25, minLevel: 1, tier: 'LOW' },
  { id: 'c07', text: 'Play 4 runs today', type: 'runs_played', target: 4, reward: 100, xp: 45, minLevel: 1, tier: 'LOW' },
  { id: 'c08', text: 'Activate 3 power-ups', type: 'powerups_used', target: 3, reward: 100, xp: 45, minLevel: 1, tier: 'LOW' },
  { id: 'c09', text: 'Activate 6 power-ups', type: 'powerups_used', target: 6, reward: 180, xp: 70, minLevel: 2, tier: 'LOW' },
  { id: 'c10', text: 'Reach a 5x combo', type: 'combo_max', target: 5, reward: 100, xp: 45, minLevel: 1, tier: 'LOW' },
  { id: 'c11', text: 'Reach a 10x combo', type: 'combo_max', target: 10, reward: 220, xp: 80, minLevel: 2, tier: 'LOW' },
  { id: 'c12', text: 'Survive 15 seconds', type: 'survive_frames', target: 900, reward: 80, xp: 35, minLevel: 1, tier: 'LOW' },
  { id: 'c13', text: 'Survive 30 seconds', type: 'survive_frames', target: 1800, reward: 160, xp: 65, minLevel: 2, tier: 'LOW' },
  { id: 'c14', text: 'Collect 2 power orbs in one run', type: 'orbs_in_run', target: 2, reward: 150, xp: 60, minLevel: 2, tier: 'LOW' },
  { id: 'c15', text: 'Pick up a shield', type: 'shield_pickups', target: 1, reward: 50, xp: 25, minLevel: 1, tier: 'LOW' },
  { id: 'c16', text: 'Pick up 2 shields today', type: 'shield_pickups', target: 2, reward: 130, xp: 50, minLevel: 2, tier: 'LOW' },
  { id: 'c17', text: 'Die 2 times', type: 'deaths', target: 2, reward: 50, xp: 20, minLevel: 1, tier: 'LOW' },
  { id: 'c18', text: 'Die 5 times', type: 'deaths', target: 5, reward: 100, xp: 35, minLevel: 2, tier: 'LOW' },
  { id: 'c19', text: 'Collect 50 total coins', type: 'total_coins', target: 50, reward: 140, xp: 50, minLevel: 1, tier: 'LOW' },
  { id: 'c20', text: 'Collect 250 total coins', type: 'total_coins', target: 250, reward: 300, xp: 100, minLevel: 2, tier: 'LOW' },
  { id: 'c21', text: 'Reach 1500 score', type: 'score_run', target: 1500, reward: 320, xp: 110, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c22', text: 'Reach 2500 score', type: 'score_run', target: 2500, reward: 450, xp: 150, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c23', text: 'Land 50 jumps today', type: 'jumps_total', target: 50, reward: 180, xp: 70, minLevel: 2, tier: 'LOW' },
  { id: 'c24', text: 'Use Gravity Flip 2 times', type: 'gravity_uses', target: 2, reward: 180, xp: 70, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c25', text: 'Use Score Doubler 2 times', type: 'doubler_uses', target: 2, reward: 220, xp: 80, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c26', text: 'Reach speed 9x', type: 'speed_max', target: 9, reward: 220, xp: 80, minLevel: 2, tier: 'LOW' },
  { id: 'c27', text: 'Reach speed 11x', type: 'speed_max', target: 11, reward: 400, xp: 140, minLevel: 4, tier: 'MEDIUM' },
  { id: 'c28', text: 'Complete 3 challenges today', type: 'challenges_done', target: 3, reward: 300, xp: 120, minLevel: 2, tier: 'LOW' },
  { id: 'c29', text: 'Play 6 runs today', type: 'runs_played', target: 6, reward: 180, xp: 70, minLevel: 2, tier: 'LOW' },
  { id: 'c30', text: 'Beat your own high score', type: 'new_high_score', target: 1, reward: 260, xp: 90, minLevel: 2, tier: 'LOW' },
  { id: 'c31', text: 'Collect 40 coins in one run', type: 'coins_in_run', target: 40, reward: 320, xp: 110, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c32', text: 'Reach 4000 score', type: 'score_run', target: 4000, reward: 550, xp: 180, minLevel: 4, tier: 'MEDIUM' },
  { id: 'c33', text: 'Survive 45 seconds', type: 'survive_frames', target: 2700, reward: 360, xp: 130, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c34', text: 'Reach a 15x combo', type: 'combo_max', target: 15, reward: 420, xp: 150, minLevel: 4, tier: 'MEDIUM' },
  { id: 'c35', text: 'Collect 5 power orbs in one run', type: 'orbs_in_run', target: 5, reward: 380, xp: 140, minLevel: 4, tier: 'MEDIUM' },
  { id: 'c36', text: 'Collect 750 total coins', type: 'total_coins', target: 750, reward: 600, xp: 200, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c37', text: 'Land 150 jumps today', type: 'jumps_total', target: 150, reward: 420, xp: 150, minLevel: 3, tier: 'MEDIUM' },
  { id: 'c38', text: 'Use Gravity Flip 5 times', type: 'gravity_uses', target: 5, reward: 450, xp: 160, minLevel: 4, tier: 'MEDIUM' },
  { id: 'c39', text: 'Reach speed 13x', type: 'speed_max', target: 13, reward: 600, xp: 220, minLevel: 5, tier: 'HIGH' },
  { id: 'c40', text: 'Reach 6000 score', type: 'score_run', target: 6000, reward: 800, xp: 280, minLevel: 5, tier: 'HIGH' },
  { id: 'c41', text: 'Survive 75 seconds', type: 'survive_frames', target: 4500, reward: 750, xp: 260, minLevel: 5, tier: 'HIGH' },
  { id: 'c42', text: 'Reach a 20x combo', type: 'combo_max', target: 20, reward: 900, xp: 300, minLevel: 5, tier: 'HIGH' },
  { id: 'c43', text: 'Collect 80 coins in one run', type: 'coins_in_run', target: 80, reward: 850, xp: 300, minLevel: 5, tier: 'HIGH' },
  { id: 'c44', text: 'Collect 1500 total coins', type: 'total_coins', target: 1500, reward: 1000, xp: 340, minLevel: 5, tier: 'HIGH' },
  { id: 'c45', text: 'Use Score Doubler 6 times', type: 'doubler_uses', target: 6, reward: 700, xp: 240, minLevel: 5, tier: 'HIGH' },
  { id: 'c46', text: 'Complete 8 challenges today', type: 'challenges_done', target: 8, reward: 850, xp: 300, minLevel: 6, tier: 'HIGH' },
  { id: 'c47', text: 'Reach 9000 score', type: 'score_run', target: 9000, reward: 1200, xp: 420, minLevel: 6, tier: 'HIGH' },
  { id: 'c48', text: 'Survive 120 seconds', type: 'survive_frames', target: 7200, reward: 1100, xp: 380, minLevel: 6, tier: 'HIGH' },
];

export function getDailyChallenges(dateSeed) {
  return [...CHALLENGES]
    .sort((a, b) => hash(`${dateSeed}_${a.id}`) - hash(`${dateSeed}_${b.id}`))
    .slice(0, 6);
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
