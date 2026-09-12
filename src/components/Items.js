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
        if (item.type === GAME_CONFIG.ITEM_TYPES.COIN && coinSprite) {
          return (
            <Image key={item.id} image={coinSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="contain" />
          );
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.SPIKE && spikeSprite) {
          return (
            <Image key={item.id} image={spikeSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="fill" />
          );
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.BOOST_PAD && boostSprite) {
          return (
            <Image key={item.id} image={boostSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="fill" />
          );
        }

        if (item.type === GAME_CONFIG.ITEM_TYPES.POWER_ORB) {
          const isShield = item.powerType === GAME_CONFIG.POWER_TYPES.SHIELD;
          const cx = item.x + item.width / 2;
          const cy = item.y + item.height / 2;
          const r = item.width / 2;

          if (isShield && shieldSprite) {
            return (
              <Image key={item.id} image={shieldSprite} x={item.x} y={item.y} width={item.width} height={item.height} fit="contain" />
            );
          }

          const color = PALETTE.POWER_COLORS[item.powerType] || PALETTE.NEON_BLUE;
          return (
            <Group key={item.id}>
              <Circle cx={cx} cy={cy} r={r + 8} color={color} opacity={0.4}>
                <BlurMask blur={10} style="solid" />
              </Circle>
              <Circle cx={cx} cy={cy} r={r} color={color} />
              <Circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.4} color={PALETTE.WHITE} opacity={0.9} />
            </Group>
          );
        }

        return null;
      })}
    </Group>
  );
}