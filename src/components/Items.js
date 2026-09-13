import React from 'react';
import { Group, Circle, Image, useImage, BlurMask } from '@shopify/react-native-skia';
import { useTheme } from '../context/ThemeContext';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Items({ items }) {
  const { theme } = useTheme();

  const coinSprite = useImage(theme.assets.coinSprite);
  const spikeSprite = useImage(theme.assets.spikeHazard);
  const boostSprite = useImage(theme.assets.boostPad);
  const shieldSprite = useImage(theme.assets.shieldAura);

  return (
    <Group>
      {items.map((item) => {
        // === COIN ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.COIN) {
          return coinSprite ? (
            <Image
              key={item.id}
              image={coinSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="contain"
            />
          ) : null;
        }

        // === SPIKE ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.SPIKE) {
          return spikeSprite ? (
            <Image
              key={item.id}
              image={spikeSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="fill"
            />
          ) : null;
        }

        // === BOOST PAD ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.BOOST_PAD) {
          return boostSprite ? (
            <Image
              key={item.id}
              image={boostSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="fill"
            />
          ) : null;
        }

        // === POWER ORB ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.POWER_ORB) {
          const isShield = item.powerType === GAME_CONFIG.POWER_TYPES.SHIELD;
          const cx = item.x + item.width / 2;
          const cy = item.y + item.height / 2;
          const r = item.width / 2;

          if (isShield && shieldSprite) {
            return (
              <Image
                key={item.id}
                image={shieldSprite}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fit="contain"
              />
            );
          }

          // Colored orb fallback for non-shield power-ups
          const color = PALETTE.POWER_COLORS[item.powerType] || theme.colors.hudBorder;
          return (
            <Group key={item.id}>
              <Circle cx={cx} cy={cy} r={r + 8} color={color} opacity={0.4}>
                <BlurMask blur={10} style="solid" />
              </Circle>
              <Circle cx={cx} cy={cy} r={r} color={color} />
              <Circle
                cx={cx - r * 0.3}
                cy={cy - r * 0.3}
                r={r * 0.4}
                color="#FFFFFF"
                opacity={0.9}
              />
            </Group>
          );
        }

        return null;
      })}
    </Group>
  );
}