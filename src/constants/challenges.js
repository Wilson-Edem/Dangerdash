import { getCachedSave } from '../utils/saveManager';


export const CHALLENGES = [
  // =========================
  // LEVEL 1 CHALLENGES
  // =========================

  {
    id: 'c01',
    text: 'Collect 8 coins in one run',
    type: 'coins_in_run',
    target: 8,
    reward: 100,
    minimumLevel: 1,
  },

  {
    id: 'c02',
    text: 'Collect 15 coins in one run',
    type: 'coins_in_run',
    target: 15,
    reward: 200,
    minimumLevel: 1,
  },

  {
    id: 'c03',
    text: 'Reach 150 score',
    type: 'score_run',
    target: 150,
    reward: 100,
    minimumLevel: 1,
  },

  {
    id: 'c04',
    text: 'Reach 400 score',
    type: 'score_run',
    target: 400,
    reward: 250,
    minimumLevel: 1,
  },

  {
    id: 'c05',
    text: 'Reach 750 score',
    type: 'score_run',
    target: 750,
    reward: 500,
    minimumLevel: 1,
  },

  {
    id: 'c06',
    text: 'Play 2 runs today',
    type: 'runs_played',
    target: 2,
    reward: 50,
    minimumLevel: 1,
  },

  {
    id: 'c07',
    text: 'Play 3 runs today',
    type: 'runs_played',
    target: 3,
    reward: 100,
    minimumLevel: 1,
  },

  {
    id: 'c10',
    text: 'Reach a 3x combo',
    type: 'combo_max',
    target: 3,
    reward: 150,
    minimumLevel: 1,
  },

  {
    id: 'c11',
    text: 'Reach a 6x combo',
    type: 'combo_max',
    target: 6,
    reward: 400,
    minimumLevel: 1,
  },

  {
    id: 'c12',
    text: 'Survive 10 seconds',
    type: 'survive_frames',
    target: 600,
    reward: 100,
    minimumLevel: 1,
  },

  {
    id: 'c13',
    text: 'Survive 20 seconds',
    type: 'survive_frames',
    target: 1200,
    reward: 300,
    minimumLevel: 1,
  },

  {
    id: 'c17',
    text: 'Die 2 times',
    type: 'deaths',
    target: 2,
    reward: 50,
    minimumLevel: 1,
  },

  {
    id: 'c18',
    text: 'Die 5 times',
    type: 'deaths',
    target: 5,
    reward: 150,
    minimumLevel: 1,
  },

  {
    id: 'c19',
    text: 'Collect 25 total coins',
    type: 'total_coins',
    target: 25,
    reward: 200,
    minimumLevel: 1,
  },

  {
    id: 'c20',
    text: 'Collect 100 total coins',
    type: 'total_coins',
    target: 100,
    reward: 500,
    minimumLevel: 1,
  },

  {
    id: 'c21',
    text: 'Reach 1000 score',
    type: 'score_run',
    target: 1000,
    reward: 800,
    minimumLevel: 1,
  },

  {
    id: 'c22',
    text: 'Reach 2000 score',
    type: 'score_run',
    target: 2000,
    reward: 1500,
    minimumLevel: 1,
  },

  {
    id: 'c23',
    text: 'Land 50 jumps today',
    type: 'jumps_total',
    target: 50,
    reward: 200,
    minimumLevel: 1,
  },

  {
    id: 'c28',
    text: 'Complete 3 challenges',
    type: 'challenges_done',
    target: 3,
    reward: 500,
    minimumLevel: 1,
  },

  {
    id: 'c29',
    text: 'Play 5 runs today',
    type: 'runs_played',
    target: 5,
    reward: 250,
    minimumLevel: 1,
  },

  {
    id: 'c30',
    text: 'Beat your own high score',
    type: 'new_high_score',
    target: 1,
    reward: 500,
    minimumLevel: 1,
  },


  // =========================
  // LEVEL 2+ CHALLENGES
  // =========================

  {
    id: 'c26',
    text: 'Reach speed 9x',
    type: 'speed_max',
    target: 9,
    reward: 300,
    minimumLevel: 2,
  },

  {
    id: 'c27',
    text: 'Reach speed 11x',
    type: 'speed_max',
    target: 11,
    reward: 600,
    minimumLevel: 2,
  },


  // =========================
  // LEVEL 4 CHALLENGES
  // =========================

  {
    id: 'c08',
    text: 'Activate 3 power-ups',
    type: 'powerups_used',
    target: 3,
    reward: 150,
    minimumLevel: 4,
  },

  {
    id: 'c09',
    text: 'Activate 6 power-ups',
    type: 'powerups_used',
    target: 6,
    reward: 300,
    minimumLevel: 4,
  },

  {
    id: 'c14',
    text: 'Collect 2 power orbs in one run',
    type: 'orbs_in_run',
    target: 2,
    reward: 200,
    minimumLevel: 4,
  },

  {
    id: 'c15',
    text: 'Pick up a shield',
    type: 'shield_pickups',
    target: 1,
    reward: 50,
    minimumLevel: 4,
  },

  {
    id: 'c16',
    text: 'Pick up 2 shields today',
    type: 'shield_pickups',
    target: 2,
    reward: 200,
    minimumLevel: 4,
  },

  {
    id: 'c24',
    text: 'Use Gravity Flip 2 times',
    type: 'gravity_uses',
    target: 2,
    reward: 100,
    minimumLevel: 4,
  },

  {
    id: 'c25',
    text: 'Use Score Doubler 2 times',
    type: 'doubler_uses',
    target: 2,
    reward: 200,
    minimumLevel: 4,
  },
];


/*
 * Daily challenges are deterministic for the day,
 * but the available pool depends on the player's level.
 *
 * Level 1:
 *   Only basic challenges.
 *
 * Level 2-3:
 *   Basic + speed challenges.
 *
 * Level 4+:
 *   Everything.
 */
export function getDailyChallenges(
  dateSeed,
  playerLevel =
    getCachedSave().level || 1
) {
  const safeLevel = Math.max(
    1,
    Number(playerLevel) || 1
  );

  const eligible =
    CHALLENGES.filter(
      (challenge) =>
        safeLevel >=
        Number(
          challenge.minimumLevel || 1
        )
    );

  const shuffled =
    [...eligible].sort(
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
    Math.min(
      3,
      shuffled.length
    )
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
