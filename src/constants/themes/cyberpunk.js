export const cyberpunkTheme = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  assets: {
    bgSky: require('../../../assets/images/background/bg_sky_gradient.png'),
    bgFar: require('../../../assets/images/background/bg_city_far.png'),
    bgNear: require('../../../assets/images/background/bg_city_near.png'),
    platformTileset: require('../../../assets/images/environment/platform_tileset.png'),
    spikeHazard: require('../../../assets/images/environment/spike_hazard.png'),
    waterTile: require('../../../assets/images/environment/water_fluid_tile.png'),
    coinSprite: require('../../../assets/images/items/coin_spritesheet.png'),
    boostPad: require('../../../assets/images/items/boost_pad.png'),
    shieldAura: require('../../../assets/images/items/shield_aura.png'),
    playerSprite: require('../../../assets/images/player/player_spritesheet.png'),
  },
  colors: {
    // HUD
    hudText: '#FFFFFF',
    hudBorder: '#00F0FF',
    hudSurface: 'rgba(3, 1, 12, 0.75)',
    comboText: '#FF007F',
    powerText: '#00F0FF',

    // Text
    titleText: '#00F0FF',
    subtitleText: '#A855F7',
    promptText: '#FFFFFF',
    gameOverText: '#FF0055',

    // Buttons
    buttonBg: 'rgba(10, 20, 30, 0.9)',
    buttonBorder: '#00F0FF',
    buttonText: '#00F0FF',

    // Screen
    screenBg: '#030108',
    overlayBg: 'rgba(5, 2, 10, 0.55)',

    // Game world
    waterColor: '#00F0FF',
    platformBase: '#121324',
    platformTopEdge: '#00F0FF',
    platformTopEdgeStart: '#7CFF7A',
    platformTopEdgeEnd: '#16C172',

    // Coin
    coinGold: '#FFD700',
    coinGlow: '#FFAA00',
  },
};
