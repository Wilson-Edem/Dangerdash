export const woodenTheme = {
  id: 'wooden',
  name: 'Plague Town',
  assets: {
    bgSky: require('../../../assets/images/theme/wooden/background/bg_sky_gradient.png'),
    bgFar: require('../../../assets/images/theme/wooden/background/bg_city_far.png'),
    bgNear: require('../../../assets/images/theme/wooden/background/bg_city_near.png'),
    platformTileset: require('../../../assets/images/theme/wooden/environment/platform_tileset.png'),
    spikeHazard: require('../../../assets/images/theme/wooden/environment/spike_hazard.png'),
    waterTile: require('../../../assets/images/theme/wooden/environment/water_tile.png'),
    coinSprite: require('../../../assets/images/theme/wooden/items/coin_spritesheet.png'),
    boostPad: require('../../../assets/images/theme/wooden/items/boost_pad.png'),
    shieldAura: require('../../../assets/images/theme/wooden/items/shield_aura.png'),
    playerSprite: require('../../../assets/images/theme/wooden/player/player_spritesheet.png'),
  },
  colors: {
    // HUD — warm brown/parchment palette
    hudText: '#F5E6C8',
    hudBorder: '#8B5A2B',
    hudSurface: 'rgba(20, 12, 5, 0.85)',
    comboText: '#FFB347',
    powerText: '#7FFF00',

    // Text
    titleText: '#F5E6C8',
    subtitleText: '#8B5A2B',
    promptText: '#F5E6C8',
    gameOverText: '#8B0000',

    // Buttons
    buttonBg: 'rgba(40, 25, 12, 0.9)',
    buttonBorder: '#8B5A2B',
    buttonText: '#F5E6C8',

    // Screen
    screenBg: '#0A0805',
    overlayBg: 'rgba(10, 8, 5, 0.65)',

    // Game world
    waterColor: '#4A6B4A',
    platformBase: '#3A2818',
    platformTopEdge: '#8B5A2B',

    // Coin (gold tones match wooden aesthetic well)
    coinGold: '#D4A017',
    coinGlow: '#8B5A2B',
  },
};