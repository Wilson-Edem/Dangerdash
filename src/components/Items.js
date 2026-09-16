import React from 'react';
import { Group, Circle, Image, useImage, BlurMask } from '@shopify/react-native-skia';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../constants/themes';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Items({ items }) {
  const { theme, themeKey } = useTheme();

  const cyberCoin = useImage(THEMES.cyberpunk.assets.coinSprite);
  const woodenCoin = useImage(THEMES.wooden.assets.coinSprite);
  const cyberSpike = useImage(THEMES.cyberpunk.assets.spikeHazard);
  const woodenSpike = useImage(THEMES.wooden.assets.spikeHazard);
  const cyberBoost = useImage(THEMES.cyberpunk.assets.boostPad);
  const woodenBoost = useImage(THEMES.wooden.assets.boostPad);
  const cyberShield = useImage(THEMES.cyberpunk.assets.shieldAura);
  const woodenShield = useImage(THEMES.wooden.assets.shieldAura);

  const coinSprite = themeKey === 'wooden' ? woodenCoin : cyberCoin;
  const spikeSprite = themeKey === 'wooden' ? woodenSpike : cyberSpike;
  const boostSprite = themeKey === 'wooden' ? woodenBoost : cyberBoost;
  const shieldSprite = themeKey === 'wooden' ? woodenShield : cyberShield;

  return (
    <Group>
      {items.map((item) => {
        if (item.type === GAME_CONFIG.ITEM_TYPES.COIN) {
          return coinSprite ? (
            <Image key={`${themeKey}-${item.id}`} image={coinSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="contain" />
          ) : null;
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.SPIKE) {
          return spikeSprite ? (
            <Image key={`${themeKey}-${item.id}`} image={spikeSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="fill" />
          ) : null;
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.BOOST_PAD) {
          return boostSprite ? (
            <Image key={`${themeKey}-${item.id}`} image={boostSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="fill" />
          ) : null;
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.POWER_ORB) {
          const isShield = item.powerType === GAME_CONFIG.POWER_TYPES.SHIELD;
          const cx = item.x + item.width / 2;
          const cy = item.y + item.height / 2;
          const r = item.width / 2;

          if (isShield && shieldSprite) {
            return (
              <Image
                key={`${themeKey}-${item.id}`}
                image={shieldSprite}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fit="contain"
              />
            );
          }

          const color = PALETTE.POWER_COLORS[item.powerType] || theme.colors.hudBorder;
          return (
            <Group key={`${themeKey}-${item.id}`}>
              <Circle cx={cx} cy={cy} r={r + 8} color={color} opacity={0.4}>
                <BlurMask blur={10} style="solid" />
              </Circle>
              <Circle cx={cx} cy={cy} r={r} color={color} />
              <Circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.4} color="#FFFFFF" opacity={0.9} />
            </Group>
          );
        }

        return null;
      })}
    </Group>
  );
}