export const UPGRADES = [
  {
    id: 'extra_jump',

    name: 'Extra Jump',

    description:
      'Add a 3rd mid-air jump',

    maxLevel: 1,

    costs: [150],
  },

  {
    id: 'magnet_range',

    name: 'Magnet Range',

    description:
      '+30px pickup radius per level',

    maxLevel: 5,

    costs: [
      75,
      150,
      300,
      500,
      750,
    ],
  },

  {
    id: 'slow_fall',

    name: 'Slow Fall',

    description:
      'Reduce gravity by 5% per level',

    maxLevel: 5,

    costs: [
      75,
      150,
      300,
      500,
      750,
    ],
  },
];