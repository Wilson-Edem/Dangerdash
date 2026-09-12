import React from 'react';
import { Group, Image, useImage } from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';

export default function Items({ items }) {
  const coinSprite = useImage(require('../../assets/images/items/coin_spritesheet.png'));
  const spikeSprite = useImage(require('../../assets/images/environment/spike_hazard.png'));
  const boostSprite = useImage(require('../../assets/images/items/boost_pad.png'));
  const shieldSprite = useImage(require('../../assets/images/items/shield_aura.png'));

  return (
    <Group>
      {items.map((item) => {
        // === COIN ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.COIN && coinSprite) {
          return (
            <Image
              key={item.id}
              image={coinSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="contain"
            />
          );
        }

        // === SPIKE ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.SPIKE && spikeSprite) {
          return (
            <Image
              key={item.id}
              image={spikeSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="fill"
            />
          );
        }

        // === BOOST PAD ===
        if (item.type === GAME_CONFIG.ITEM_TYPES.BOOST_PAD && boostSprite) {
          return (
            <Image
              key={item.id}
              image={boostSprite}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fit="fill"
            />
          );
        }

        // === POWER ORB ===
        // If it's a SHIELD orb, use shield_aura.png. Otherwise draw a colored circle.
        if (item.type === GAME_CONFIG.ITEM_TYPES.POWER_ORB) {
          const isShield = item.powerType === GAME_CONFIG.POWER_TYPES.SHIELD;
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
          // For other power types, we don't have individual sprites yet.
          // Returning null skips rendering until sprites exist.
          // (If you want visible orbs now, uncomment the Circle fallback below.)
          return null;
        }

        return null;
      })}
    </Group>
  );
}