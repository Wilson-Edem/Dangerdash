import React from 'react';
import { Group, Circle, Image, useImage, BlurMask } from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Items({ items }) {
  const coinSprite = useImage(require('../../assets/images/items/coin_spritesheet.png'));
  const spikeSprite = useImage(require('../../assets/images/environment/spike_hazard.png'));
  const boostSprite = useImage(require('../../assets/images/items/boost_pad.png'));
  const shieldSprite = useImage(require('../../assets/images/items/shield_aura.png'));

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
          const centerX = item.x + item.width / 2;
          const centerY = item.y + item.height / 2;
          const radius = item.width / 2;

          // Shield orbs use the shield_aura.png sprite
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

          // All other power types: colored glowing orb fallback
          const color = PALETTE.POWER_COLORS[item.powerType] || PALETTE.NEON_BLUE;
          return (
            <Group key={item.id}>
              {/* Outer glow halo */}
              <Circle cx={centerX} cy={centerY} r={radius + 6} color={color} opacity={0.35}>
                <BlurMask blur={8} style="solid" />
              </Circle>

              {/* Solid orb body */}
              <Circle cx={centerX} cy={centerY} r={radius} color={color} />

              {/* Bright white highlight */}
              <Circle
                cx={centerX - radius * 0.3}
                cy={centerY - radius * 0.3}
                r={radius * 0.35}
                color={PALETTE.WHITE}
                opacity={0.9}
              />

              {/* Dark core ring for depth */}
              <Circle
                cx={centerX}
                cy={centerY}
                r={radius * 0.65}
                color={color}
                style="stroke"
                strokeWidth={2}
              />
            </Group>
          );
        }

        return null;
      })}
    </Group>
  );
}