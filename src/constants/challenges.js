

export const CHALLENGES = [
  {
    id: 'c01',
    text: 'Collect 15 coins in one run',
    type: 'coins_in_run',
    target: 15,
    reward: 100,
  },

  {
    id: 'c02',
    text: 'Collect 25 coins in one run',
    type: 'coins_in_run',
    target: 25,
    reward: 200,
  },

  {
    id: 'c03',
    text: 'Reach 250 score',
    type: 'score_run',
    target: 250,
    reward: 100,
  },

  {
    id: 'c04',
    text: 'Reach 500 score',
    type: 'score_run',
    target: 500,
    reward: 250,
  },

  {
    id: 'c05',
    text: 'Reach 1000 score',
    type: 'score_run',
    target: 1000,
    reward: 500,
  },

  {
    id: 'c06',
    text: 'Play 2 runs today',
    type: 'runs_played',
    target: 2,
    reward: 50,
  },

  {
    id: 'c07',
    text: 'Play 4 runs today',
    type: 'runs_played',
    target: 4,
    reward: 100,
  },

  {
    id: 'c08',
    text: 'Activate 3 power-ups',
    type: 'powerups_used',
    target: 3,
    reward: 150,
  },

  {
    id: 'c09',
    text: 'Activate 6 power-ups',
    type: 'powerups_used',
    target: 6,
    reward: 300,
  },

  {
    id: 'c10',
    text: 'Reach a 5x combo',
    type: 'combo_max',
    target: 5,
    reward: 150,
  },

  {
    id: 'c11',
    text: 'Reach a 10x combo',
    type: 'combo_max',
    target: 10,
    reward: 400,
  },

  {
    id: 'c12',
    text: 'Survive 15 seconds',
    type: 'survive_frames',
    target: 900,
    reward: 100,
  },

  {
    id: 'c13',
    text: 'Survive 30 seconds',
    type: 'survive_frames',
    target: 1800,
    reward: 300,
  },

  {
    id: 'c14',
    text: 'Collect 2 power orbs in one run',
    type: 'orbs_in_run',
    target: 2,
    reward: 200,
  },

  {
    id: 'c15',
    text: 'Pick up a shield',
    type: 'shield_pickups',
    target: 1,
    reward: 50,
  },

  {
    id: 'c16',
    text: 'Pick up 2 shields today',
    type: 'shield_pickups',
    target: 2,
    reward: 200,
  },

  {
    id: 'c17',
    text: 'Die 2 times',
    type: 'deaths',
    target: 2,
    reward: 50,
  },

  {
    id: 'c18',
    text: 'Die 5 times',
    type: 'deaths',
    target: 5,
    reward: 150,
  },

  {
    id: 'c19',
    text: 'Collect 50 total coins',
    type: 'total_coins',
    target: 50,
    reward: 200,
  },

  {
    id: 'c20',
    text: 'Collect 250 total coins',
    type: 'total_coins',
    target: 250,
    reward: 500,
  },

  {
    id: 'c21',
    text: 'Reach 1500 score',
    type: 'score_run',
    target: 1500,
    reward: 800,
  },

  {
    id: 'c22',
    text: 'Reach 2500 score',
    type: 'score_run',
    target: 2500,
    reward: 1500,
  },

  {
    id: 'c23',
    text: 'Land 50 jumps today',
    type: 'jumps_total',
    target: 50,
    reward: 200,
  },

  {
    id: 'c24',
    text: 'Use Gravity Flip 2 times',
    type: 'gravity_uses',
    target: 2,
    reward: 100,
  },

  {
    id: 'c25',
    text: 'Use Score Doubler 2 times',
    type: 'doubler_uses',
    target: 2,
    reward: 200,
  },

  {
    id: 'c26',
    text: 'Reach speed 9x',
    type: 'speed_max',
    target: 9,
    reward: 300,
  },

  {
    id: 'c27',
    text: 'Reach speed 11x',
    type: 'speed_max',
    target: 11,
    reward: 600,
  },

  {
    id: 'c28',
    text: 'Complete 3 challenges',
    type: 'challenges_done',
    target: 3,
    reward: 500,
  },

  {
    id: 'c29',
    text: 'Play 6 runs today',
    type: 'runs_played',
    target: 6,
    reward: 250,
  },

  {
    id: 'c30',
    text: 'Beat your own high score',
    type: 'new_high_score',
    target: 1,
    reward: 500,
  },
];

/*
 * Deterministic daily challenge selection.
 *
 * The same date always produces the same
 * three challenges.
 */
export function getDailyChallenges(
  dateSeed
) {
  const shuffled =
    [...CHALLENGES].sort(
      (a, b) => {
        const ha = hash(
          `${dateSeed}_${a.id}`
        );

        const hb = hash(
          `${dateSeed}_${b.id}`
        );

        return ha - hb;
      }
    );

  return shuffled.slice(
    0,
    3
  );
}

function hash(str) {
  let h = 2166136261;

  for (
    let i = 0;
    i < str.length;
    i++
  ) {
    h ^= str.charCodeAt(i);

    h = Math.imul(
      h,
      16777619
    );
  }

  return Math.abs(h);
}